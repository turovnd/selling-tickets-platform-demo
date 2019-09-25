#!/usr/bin/env bash

echo 'Creating application user and db'

mongo ${MONGO_DATABASE} \
        --host localhost \
        -u ${MONGO_INITDB_ROOT_USERNAME} \
        -p ${MONGO_INITDB_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${MONGO_USER}', pwd: '${MONGO_PASSWORD}', roles:[{role:'dbOwner', db: '${MONGO_DATABASE}'}]});"