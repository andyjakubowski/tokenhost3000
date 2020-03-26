const resizeCanvas = function resizeCanvas() {
  const canvas = document.querySelector('.glslCanvas');
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
};

if (document.readyState !== 'loading') {
  resizeCanvas();
} else {
  window.addEventListener('load', resizeCanvas);
}
