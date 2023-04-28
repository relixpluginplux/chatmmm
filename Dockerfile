

FROM node:14



RUN git clone https://github.com/Danielperfull-00/telegram-turbo-gpt
RUN npm i
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY pnyqolk46corcwg
ENV PM2_SECRET_KEY zpswkvxaao9fr0c

CMD ["pm2-runtime", "index.js"]
