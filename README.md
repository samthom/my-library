# my-library
Simple project that uses redis plugins such as redisjson and redisearch to implement my library app

## Storing data
To use insert json into Redis run `npm run insert books.json`.

### Queries implemented
1. Simple search on text attributes of `idx:books` index 
```
FT.SEARCH idx:books Kaz
```

2. Simple sorting using search
```
FT.SEARCH idx:books * SORTBY rating DESC RETURN 2 name rating 
```

3. Aggregate query with multiple steps
```
FT.AGGREGATE idx:books * GROUPBY 1 @author REDUCE COUNT 0 AS no_of_books SORTBY 2 @no_of_books DESC LIMIT 0 5
```

## Nodejs Project
[Redis](https://github.com/redis/node-redis) package
Command to run rest API
```
npm run start
```

### Endpoints
| Query         | Endpoint | 
|--------------|:---------:|
| Search       |  localhost:8000?search=Kaz | 
| Sort         |  localhost:8000/top        | 
| Aggregation  |  localhost:8000/most-read  |
