export function WebGLCheck() {
  const hasWebGL = !!window.WebGLRenderingContext && 
    !!document.createElement('canvas').getContext('webgl');

  if (!hasWebGL) {
    document.body.innerHTML = `
      <div style="
        background:#000;color:#fff;height:100vh;display:grid;place-items:center;
        text-align:center;font-family:system-ui,sans-serif;padding:2rem;
      ">
        <div>
          <h1>This experience requires WebGL</h1>
          <p>Please update your browser or try on a different device.</p>
        </div>
      </div>
    `;
    throw new Error("WebGL not supported");
  }
}