# To create db

``` bash
docker run --name footydb -e POSTGRES_PASSWORD=mysupersecretpassword -p 5432:5432 -d postgres
```

then database in image

``` bash
docker exec -it footydb psql -U postgres -c "CREATE DATABASE footydb;"
```