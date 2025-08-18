import modal


image = (
  modal.Image.debian_slim(python_version='3.12')
    .pip_install(
      'fastapi[standard]',
    )
    .add_local_file('index.html', '/root/')
    .add_local_file('404.html', '/root/')
    .add_local_dir('static', '/root/static')
    .add_local_dir('html', '/root/html')
)
app = modal.App(
  'moe',
  image=image,
)


@app.function(
  region='asia-southeast1',
  cloud='gcp',
)
@modal.concurrent(max_inputs=100)
@modal.asgi_app()
def f():
  from fastapi import FastAPI, Request
  from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
  import os 
  
  app = FastAPI()
  def response404():
    with open('404.html', 'r') as f:
      return HTMLResponse(f.read())
    
  @app.get("/{path:path}")
  async def _(request: Request):
    # print([i for i in request.__dir__() if not i.startswith('_')])
    path = request.path_params['path']
    if path == '' or path.endswith('/'):
      if os.path.isfile(f'{path}index.html'):
        with open(f'{path}index.html', 'r') as f:
          return HTMLResponse(f.read())
    if os.path.isdir(path):
      return RedirectResponse(url=f'/{path}/')
    if path.endswith('.html') or path.endswith('.htm'):
      if os.path.isfile(path):
        with open(path, 'r') as f:
          return HTMLResponse(f.read())
      return response404()
    
    if os.path.isfile(path):
      return FileResponse(path, headers={
        'Cache-Control': 'max-age=86400',
      })
    
    return response404()
  
  return app
