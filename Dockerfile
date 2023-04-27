


RUN pip install -r requirements.txt
RUN npm install -g pm2
RUN pm2 link zpswkvxaao9fr0c pnyqolk46corcwg
RUN pm2 start index.js


