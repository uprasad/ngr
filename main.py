import os
import uuid

import jinja2
import webapp2

from google.appengine.api import channel

JINJA_ENV = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

class MainPage(webapp2.RequestHandler):
	def get(self):
		template = JINJA_ENV.get_template('index.html')
		self.response.write(template.render())

class AboutPage(webapp2.RequestHandler):
	def get(self):
		self.response.write('About Page')

class ContactPage(webapp2.RequestHandler):
	def get(self):
		self.response.write('Contact Page')

application = webapp2.WSGIApplication([
	('/', MainPage),
	('/about', AboutPage),
	('/contact', ContactPage),
], debug=True)