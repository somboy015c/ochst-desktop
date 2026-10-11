use tauri::{WebviewUrl, WebviewWindowBuilder};

// The staff portal looks for "OCHSTDesktop" in the browser string and, when it is there,
// leaves out the "Download app" button (you are already in the app).
#[cfg(target_os = "windows")]
const USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OCHSTDesktop/1.0";
#[cfg(target_os = "macos")]
const USER_AGENT: &str = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 OCHSTDesktop/1.0";
#[cfg(not(any(target_os = "windows", target_os = "macos")))]
const USER_AGENT: &str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OCHSTDesktop/1.0";

// Safety net on every page: if a page still contains a download button, hide it.
const HIDE_DOWNLOAD: &str = r#"
(function () {
  var css = '#dlbtn,#dlpop,.dl-btn,.dl-pop{display:none!important}';
  function add() {
    if (document.getElementById('ochst-desktop-css')) return;
    var s = document.createElement('style'); s.id = 'ochst-desktop-css'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    document.documentElement.classList.add('ochst-desktop');
  }
  add();
  document.addEventListener('DOMContentLoaded', add);
})();
"#;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
                .title("OCHST Staff")
                .inner_size(1240.0, 820.0)
                .min_inner_size(480.0, 640.0)
                .center()
                .user_agent(USER_AGENT)
                .initialization_script(HIDE_DOWNLOAD)
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running the OCHST Staff app");
}
