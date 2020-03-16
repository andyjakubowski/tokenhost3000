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

    coord.x = coord.x - cos(coord.y + sin(len)) + cos(u_time / 50.0);
    coord.y = coord.y + sin(coord.x + cos(len)) + sin(u_time / 55.0);
  }

  // gl_FragColor = vec4(cos(len * 2.0), cos(len * 3.0), cos(len * 1.0), 1.0);

  // we can have a seperate color, obviously. so comment out the gl_FragColor above & uncomment the lines below
  vec3 color = vec3(clamp(cos(len * 0.33), 0.0, 0.3), clamp(cos(len * 0.29), 0.0, 0.3), clamp(cos(len * 0.45), 0.0, 0.3));
  gl_FragColor = vec4(color, 1.0);
}