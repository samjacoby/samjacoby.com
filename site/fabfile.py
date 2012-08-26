from fabric.api import *
import os
import fabric.contrib.project as project

PROD = 'shackman@shackmanpress.com'
SITE_CONFIG = 'site.yaml'
PROD_CONFIG = 'prod.yaml'
DEST_PATH = '/home/shackman/public_html/samjacoby.com/'
ROOT_PATH = os.path.abspath(os.path.dirname(__file__))
DEPLOY_PATH = os.path.join(ROOT_PATH, 'deploy')

def clean():
    local('rm -rf ./deploy')

def generate(config=SITE_CONFIG):
    local('hyde gen -c %s' % config)

def regen(config=SITE_CONFIG):
    clean()
    generate(config)

def serve():
    local('hyde serve')

def reserve():
    regen()
    serve()

def smush():
    local('smusher ./media/images')

@hosts(PROD)
def publish():
    regen(PROD_CONFIG)
    project.rsync_project(
        remote_dir=DEST_PATH,
        local_dir=DEPLOY_PATH.rstrip('/') + '/',
        delete=True
    )

