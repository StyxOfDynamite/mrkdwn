use std::sync::Mutex;
use tauri::{Emitter, Manager};
use tauri_plugin_fs::FsExt;

/// Holds a file path the OS asked us to open before the frontend had a chance to register its
/// `listen("open-file-path")` handler (always true at cold start: RunEvent::Opened on macOS, and
/// the setup() argv check on Windows/Linux, both fire before the webview's JS has run). The
/// frontend pulls this once via `take_initial_file_path` on mount instead of relying on the
/// push event for that first file, eliminating the race. Subsequent opens, while already
/// running, use the push event as normal since the listener is registered by then.
struct InitialFilePath(Mutex<Option<String>>);

#[tauri::command]
fn take_initial_file_path(state: tauri::State<InitialFilePath>) -> Option<String> {
    state.0.lock().unwrap().take()
}

/// Paths the OS hands us via file-association (RunEvent::Opened / single-instance re-launch
/// argv) bypass our Open dialog entirely, so they never get the dialog plugin's automatic
/// fs-scope extension. Grant access to exactly this one file at runtime instead of a broad
/// static capability, keeping the standing fs scope minimal.
fn allow_path<R: tauri::Runtime>(app: &tauri::AppHandle<R>, path: &str) {
    let _ = app.fs_scope().allow_file(path);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            // On Windows/Linux, a re-launch (e.g. double-clicking another .md file) spawns a new
            // OS process with the file path as argv[1]; forward it into this running instance.
            // The frontend's listener is already registered by now, so the push event is safe.
            if let Some(path) = args.get(1) {
                allow_path(app, path);
                let _ = app.emit("open-file-path", path.clone());
            }
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }));
    }

    builder
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .manage(InitialFilePath(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![take_initial_file_path])
        .setup(|app| {
            // Cold-start case on Windows/Linux: the OS launched a fresh process with a file path
            // argument. Store it for the frontend to pull once ready (see InitialFilePath above).
            let args: Vec<String> = std::env::args().collect();
            if let Some(path) = args.get(1) {
                allow_path(app.handle(), path);
                *app.state::<InitialFilePath>().0.lock().unwrap() = Some(path.clone());
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Opened { urls } = event {
                for url in urls {
                    if let Ok(path) = url.to_file_path() {
                        let path = path.to_string_lossy().to_string();
                        allow_path(app_handle, &path);
                        // Cold-start case on macOS: this fires before the frontend is ready, so
                        // stash it for the pull-based command rather than only emitting.
                        let state = app_handle.state::<InitialFilePath>();
                        let mut guard = state.0.lock().unwrap();
                        if guard.is_none() {
                            *guard = Some(path.clone());
                        }
                        drop(guard);
                        let _ = app_handle.emit("open-file-path", path);
                    }
                }
            }
            #[cfg(not(target_os = "macos"))]
            let _ = (app_handle, event);
        });
}
