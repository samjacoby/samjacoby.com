from fabric.api import *
import os
import fabric.contrib.project as project

PROD = 'shackman@shackmanpress.com'
KEY = '/homes/sjacoby/.ssh/orville.pem'

SITE_CONFIG = 'site.yaml'
PROD_CONFIG = 'prod.yaml'

DEST_PATH = '/home/shackman/public_html/samjacoby.com/'
ROOT_PATH = os.path.abspath(os.path.dirname(__file__))
DEPLOY_PATH = os.path.join(ROOT_PATH, 'deploy')

PROD_AWS = 'sjacoby@yarbo.mooo.com'
DEST_PATH_AWS= '/home/sjacoby/public_html/samjacoby.com/'

def clean():
    local('rm -rf ./deploy')

def gen(config=SITE_CONFIG):
    generate(config)

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
    local('git push')
    regen(PROD_CONFIG)
    project.rsync_project(
        remote_dir=DEST_PATH,
        local_dir=DEPLOY_PATH.rstrip('/') + '/',
        delete=True
    )
    run('ln -s ~/public_html/static ~/public_html/samjacoby.com/')

@hosts(PROD_AWS)
def publish_aws():
    regen(PROD_CONFIG)
    project.rsync_project(
        ssh_opts='-i ' + KEY,
        remote_dir=DEST_PATH_AWS,
        local_dir=DEPLOY_PATH.rstrip('/') + '/',
        delete=True
    )
    run('cd public_html/samjacoby.com/')
    run('ln -s ~/public_html/static ~/public_html/samjacoby.com/')

