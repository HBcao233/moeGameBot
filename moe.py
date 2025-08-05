import modal


image = (
  modal.Image.debian_slim(python_version='3.12')
    .pip_install(
      'fastapi[standard]',
    )
    .add_local_file('index.html', '/root/')
    .add_local_file('404.html', '/root/')
    .add_local_file('main.js', '/root/')
    .add_local_file('main.css', '/root/')
    .add_local_dir('images', '/root/images')
    .add_local_dir('svg', '/root/svg')
)
app = modal.App(
  'moe',
  image=image,
)


@app.function(
  region='ap-southeast',
  cloud='gcp',
)
@modal.concurrent(max_inputs=100)
@modal.asgi_app()
def f():
  from fastapi import FastAPI, Request
  from fastapi.responses import HTMLResponse, FileResponse
  import os 
  
  app = FastAPI()
  def response404():
    with open('404.html', 'r') as f:
      return HTMLResponse(f.read())
    
  @app.get("/{path:path}")
  async def _(request: Request):
    # print([i for i in request.__dir__() if not i.startswith('_')])
    path = request.path_params['path']
    if path == '':
      with open('index.html', 'r') as f:
        return HTMLResponse(f.read())
    if path.endswith('.html') or path.endswith('.htm'):
      if os.path.isfile(path):
        with open('index.html', 'r') as f:
          return HTMLResponse(f.read())
      return response404()
    
    if os.path.isfile(path):
      return FileResponse(path)
    
    return response404()
  
  return app
