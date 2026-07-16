FROM alm-repos.sogei.it/paas-base-image/nginx:1.25.2-alpine3.18-slim
ENV TZ=Europe/Rome

COPY ./dist /usr/share/nginx/html/


#COPY ./infrastructure/runtime/default.conf /etc/nginx/conf.d/default.conf

RUN chgrp -R 0 /var/cache/ /var/log/ /var/run/ && \
    chmod -R g=u /var/cache/ /var/log/ /var/run/

ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 8080
