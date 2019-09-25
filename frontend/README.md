#### The project was built by `@vue/cli` and upgrade by custom improvements.

## Project structure
- `src/api` module for work with API endpoint, it has functions for simplify making CRUD requests and set query attributes:
    - `.submit(method, url, data)` Send custom request with data
    - `.all()` Send GET request for retrieve all entities from the endpoint
    - `.find(id)` Send GET request for retrieve entity by id from the endpoint
    - `.create(data)` Send POST request with data to the endpoint
    - `.update(id, data)` Send PUT request with id and data to the endpoint
    - `.destroy(id)` Send DELETE request with id to the endpoint
    - `.setParameters({key: value})` Set query parameters to the request `?key=value`
    - `.setParameter(key, value)` Set query parameter to the request `?key=value`
    - `.removeParameters([key,key1])` Remove query parameters from the request
    - `.removeParameter(key)` Remove query parameter from the request
    - `.getParameterString()` Return query parameter string `?key=value&key1=value1`
- `src/assets` any static files that will copy while building
- `src/components` common components that used in views
- `src/config` any configuration files
- `src/locale` i18n translation files
- `src/plugins` plugins that add to vue by `Vue.use` or `Vue.component`
- `src/routes` the description of routes in the application
- `src/services` services that used for Authorization, Firebase Cloud Messaging, etc. 
- `src/store` Vuex store with modules feature
- `src/transformers` used for transforming API responses before commit to Vuex
    - `.fetchCollections(array)` method used to transform fetched collections by calling `.fetch` method
    - `.fetch(item)` method used to transform a fetched collection
    - `.sendCollections(array)` method used to transform collections to be send by calling `.send` method
    - `.send(item)` method used to transform a collection to be send
     
- `src/views` all pages placed here 
 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
