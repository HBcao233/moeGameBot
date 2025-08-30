import modal


image = (
  modal.Image.debian_slim(python_version='3.12')
    .pip_install(
      'fastapi[standard]',
    )
    .add_local_dir('src', '/root/src')
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
    with open('src/404.html', 'r') as f:
      return HTMLResponse(f.read())
    
  @app.get("/{path:path}")
  async def _(request: Request):
    # print([i for i in request.__dir__() if not i.startswith('_')])
    path = request.path_params['path']
    if path == '' or path.endswith('/'):
      if os.path.isfile(f'src/{path}index.html'):
        with open(f'src/{path}index.html', 'r') as f:
          return HTMLResponse(f.read())
    
    if path.startswith('html/'):
      return RedirectResponse(url='/' + path[5:])
    if os.path.isdir(path):
      return RedirectResponse(url=f"/{path.rstrip('/')}/")
    
    if path.endswith('.html') or path.endswith('.htm'):
      if os.path.isfile('src/' + path):
        with open('src/' + path, 'r') as f:
          return HTMLResponse(f.read())
      return response404()
    
    if os.path.isfile('src/' + path):
      return FileResponse('src/' + path, headers={
        'Cache-Control': 'max-age=604800',
      })
    return response404()
  
  return app
