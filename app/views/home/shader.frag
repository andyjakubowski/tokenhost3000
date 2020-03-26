#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

const int AMOUNT = 10;

void main(){
  vec2 coord = 20.0 * (gl_FragCoord.xy - u_resolution / 2.0) / min(u_resolution.y, u_resolution.x);

  float len;

  for (int i = 0; i < AMOUNT; i++){
    len = length(vec2(coord.x, coord.y));

    coord.x = coord.x - cos(coord.y + sin(len)) + cos(u_time / 20.0);
    coord.y = coord.y + sin(coord.x + cos(len)) + sin(u_time / 25.0);
  }

  float max_alpha = 0.6;
  vec3 color = vec3(clamp(cos(len * 0.33), 0.0, max_alpha), clamp(cos(len * 0.29), 0.0, max_alpha), clamp(cos(len * 0.45), 0.0, max_alpha));
  gl_FragColor = vec4(color, 1.0);
}