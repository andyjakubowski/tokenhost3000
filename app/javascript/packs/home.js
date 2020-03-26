const resizeCanvas = function resizeCanvas() {
  const canvas = document.querySelector('.glslCanvas');
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;
};

if (document.readyState !== 'loading') {
  resizeCanvas();
} else {
  window.addEventListener('load', resizeCanvas);
}