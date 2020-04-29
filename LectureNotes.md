# Multi-Table Queries

### Notes

1. Aggregate Functions

    A. Essentially, when you run these functions in SQL, it's much more efficient than JavaScript since we don't have to return as much data to our application.


    B. [Aggregate functions](https://www.sqlite.org/lang_aggfunc.html) are just helper functions we can call directly in the SQL statement. You can use them to 
        
    * count rows, 

    * perform calculations,

    * basic arithmetic,

    * get the average of numbers,

    * generate random numbers, etc. 


    C. _Scenario:_ We want the total quantity of all of the rows in OrderDetail (from the northwind.db3 file) for the product with the ID of 11. 

    ```
    SELECT * FROM "OrderDetail"
    WHERE "ProductId" = 11;
    ```

    * Instead of selecting all from OrderDetail where the product is 11, you can use the SUM command for the Quantity and create an alias for it.  

    * SUM is an _aggregate function_. It will need the `()`. Add a column name to pass through it. 

    * Assign it to an alias as TotalQuantity. Now, instead of selecting a specific column from our database, we're essentially a single column and telling it to add together (using that SUM function) and return the sum result. 

    * Your result should be 206431. 

    ```
    SELECT SUM("Quantity") AS "TotalQuantity" FROM "OrderDetail"
    WHERE "ProductId" = 11;
    ```


    D. _Scenario:_ We want to see the quantity of every single product... not just Product 11. 
    
    * Leave out the Where. We're selecting _everything._

    * Select the SUM of the quantity. 

    * Since we're selecting multiple products (multiple rows), also select the ProductId column. 

    * After our From statement, we can specify by our GROUP BY command, where we group by the column, ProductID. 
    
        * If you run it at this point, the query is going to take a while on your machine. 
        
        * The result shows every single product that's been ordered and shows the Total Quantity of each product. This is doing a _ton_ of math under the hood. If you look at the order detail table, you'll see over 621,000 rows. 

    ```
    SELECT "ProductId", SUM("Quantity") AS "TotalQuantity" FROM "OrderDetail"
    GROUP BY "ProductId";
    ```


    E. _Scenario:_ In a single query, you want to figure out how many products are in each category. Hint: You'll use the `COUNT` [aggregate function](https://www.sqlite.org/lang_aggfunc.html). 

    * Call Count from the Product table using Select. 
    
    * Pass the column name ID into it or you can use the wildcard to get them all. Either will work.

    * Don't forget to select the CategoryId so you can actually see what category the count is associated with. 

    * Give the Count an alias as TotalProducts. 

    ```
    SELECT "CategoryId", COUNT(*) AS "TotalProducts" FROM "Product";
    ```

    * If you submit this command as is, you will receive a single row of 77. This won't work because we don't want the total products for the entire table; we want them grouped by categories. 

    * We can fix that with GROUP BY and specify the CategoryId. When you run it, you will get a list of each category and how many products are in each one. It returns 8 rows. 

    ```
    SELECT "CategoryId", COUNT(*) AS "TotalProducts" FROM "Product"
    GROUP BY "CategoryId";
    ```


2. Defining and using Relationships Between Tables with SQLite, a relational database. 

    * If you remember, a primary key is the identifying column(s) of a table. With that in mind, a **_foreign key_** is a type of column that points to the primary key of a different table by having the same value as that primary key. In essence, we're creating a makeshift relationship. Essentially making links between the tables. 

    * Scenario: We have blog database and the database has many, many authors. Each author has many different blog posts. 

        * We have a table named authors. It has a column called ID and a column called name (for the author name).

        ```
        id          name
        ____________________________
        1           Jane Doe
        ```

        * If we want to associate blog posts with these authors in our database, we have a couple of different options. 

            * Create a posts column in the authors table. It would get the job done for now... But not really super scalable this way. In this case, it's essentially limiting the number of posts that an author can have by the number of columns we have. 

            ```
            id          name        post1_text      post2_text
            ________________________________________________________
            1           Jane Doe    Welcome         Getting Started
            ```

            * Instead, let's create a new table called posts. That table will have an ID column and a text column.
            
            ```
            id          text
            ____________________________
            1           Welcome
            2           Getting Started
            ```
            
            *  But how do we associate the blog posts with the authors? We create a foreign key column. You could call it author_id. That author ID is what associates a blog post with an author. 

            ```
            // Author Table
            id          name        
            _____________________________
            1           Jane Doe    
            2           Stephen Merchant

            // Posts Table
            id          text                author_id
            _______________________________________________________
            1           Welcome             1
            2           Getting Started     1
            1           Hi. I'm Stephen.    2
            2           I'm friends with... 2
            ```

    * Foreign Keys do not need to be unique. Since their job is to literally point to another identifier in different table - rather than be the identifier itself. You can have multiple foreign keys in a table pointing to the same primary key. _It's the primary key that has to be unique._ Foreign keys just need to _match_ the primary key.

    * Go back into the northwind.db3 file again. 

        * Product Table 

            * Look at the columns

                * SupplierId is a foreign key pointing to the Supplier table

                * CategoryId is a foreign key pointing to the Category table

            * This is the _relational_ part of our database.

                * This is how rows can be related to other rows - by having foreign keys point to each other. 


3. How to Query Multiple Tables at the Same Time

    We want SQL to read through the foreign key to get the values from the other tables during the query. 

    A. Example: 

    * Let's select everything from the OrderDetails table. 

    * Limit to 1 result for now. 

    ```
    SELECT * FROM "OrderDetail" LIMIT 1;
    ```


    B. _Scenario:_ Let's say we want to get the product details. In the results, we can't tell what that product is. It's only showing an id. 

    * Luckily, with SQL, it comes with these things called joins. Join is a SQL command that we can use to query multiple tables in one statement. They combine results into one singular result. 

    * Separate Select and Limit onto different lines then add in JOIN. 

    * We want to join the product table. Right now, we essentially have 2 tables that our query is looking at! We can now use those 2 tables to look at different pieces of data. 

    ```
    SELECT * FROM "OrderDetail" 
    JOIN "Product"
    LIMIT 1;
    ```

    * With Join statements, they should always go hand in hand with a condition. In this situation, we want to look for every row that has the OrderDetail table and the ProductId column. They should be equal to the Product table and the Id column. 

    ```
    SELECT * FROM "OrderDetail" 
    JOIN "Product" ON "OrderDetail"."ProductId" = "Product"."Id"
    LIMIT 1;
    ```

    * What the code above is saying is "Select everything from the OrderDetail table. Then for each resulting row, find the row and the product table where the Id matches the row we have in our foreign key. Find every row where this ON condition is true. Take that resulting data and stick it on the right side of our results, so that it looks like it's all coming from a single table."

    * When you submit that command, notice that we can now see the product columns alongside the order columns. So we can now see the ProductId of 11 and the actual ProductName and all the other information associated with that product -- instead of just the id like before. 
    
    * If you take out the LIMIT 1, you get over 621K rows. It finds a matching product for every row in our results. 

    * One thing to notice when we're combining tables into a single query, we are going to have some duplicated column names every once in a while (like the ID column name). It's because the query is combining both tables into one giant table. 

        * We can fix that by changing our selector from all to specific columns instead. 

        * Instead of selecting single column names like `"Id"`, we can now prefix it with the table name we actually want to select the column from. In this instance, we care about the OrderDetail id, not the product id.  

        * Let's also select the OrderDetail quantity and the Product Name. 

        ```
        SELECT "OrderDetail"."Id", "OrderDetail"."Quantity", "Product"."ProductName" 
        FROM "OrderDetail" 
        JOIN "Product" ON "OrderDetail"."ProductId" = "Product"."Id"
        ```

        * This is much nicer and easier to read the information you need. Although you are still get 100s of 1000s of rows. 

        * The code itself needs a bit of a cleanup. We'll update it to include the **_aliases_**. Since we're reusing OrderDetail table name several times, we could an alias to shorten it up a bit.

            * After FROM's "OrderDetail", we can change it to AS "o"

            * We can also shorten Product to p in case we have several instances of it as well.

        ```
        SELECT o."Id", 0."Quantity", "Product"."ProductName" FROM "OrderDetail" AS o 
        JOIN "Product" AS p ON o."ProductId" = p."Id" 
        ```


    C. _Scenario:_ In a single query, find the employee's first name and last name associated with order #16608. 

    * If you look in the Orders table, you see 16k+ orders and it has an EmployeeId associated with an individual order. 

    * Let's select the specific order we want (16608)

    ```
    SELECT * FROM "Order"
    WHERE "Id" = 16608;
    ```

    * We need to see the employee's first and last names; we don't care that the EmployeeId is 9. Let's join in another table. 

    * Since we're selecting from multiple tables, we need to specify order on the where statement. 

    ```
    SELECT * FROM "Order"
    JOIN "Employee" ON "Employee"."Id" = "Order"."EmployeeId"
    WHERE "Order"."Id" = 16608;
    ```

    * The code above gives us everything. But we don't want everything. Let's select the first name, last name, and the employee id. 

    * Also, to prevent this table from getting super long, let's use aliases. 

    ```
    SELECT o."Id", e."FirstName", e."LastName" FROM "Order" AS o
    JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    WHERE o."Id" = 16608;
    ```
    
    * You can also create aliases for the first name and last name as a way to specify between tables when columns have the same name. 

    ```
    SELECT o."Id", e."FirstName" "EmployeeFirstName", e."LastName" "EmployeeLastName" 
    FROM "Order" AS o
    JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    WHERE o."Id" = 16608;
    ```

    * If the code above gets too long, you can shorten it however you like, as long as there is a semi-colon on the very end. 

    ```
    SELECT 
        o."Id", 
        e."FirstName" "EmployeeFirstName", 
        e."LastName" "EmployeeLastName" 
    FROM "Order" AS o
    JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    WHERE o."Id" = 16608;
    ```

    * As you can see when you run it, the order was handled by `Anne Dodsworth`.

    * Our SQL statements are getting a little bit more complicated. But so far so good. 


    D. _Scenario:_ Let's say we wanted to add yet another table to the result. We can actually have multiple Joins in a single query. We're not limited in joining just 1 additional table. 

    * If you look in the Browse Data of the Order table, you will see that Order also has customers. Let's pull in the customer name too. 

    * Right after the first join, let's put in another one and join the Customer table. Make the alias of Customer as "c." If you submit it as is, nothing happens because you're not selecting anything else. 

    * Select the ContactName column and provide a customer alias. Now that you've added that, you will see the order Id, EmployeeFirstName, EmployeeLastName, and CustomerName. 

    ```
    SELECT 
        o."Id", 
        e."FirstName" "EmployeeFirstName", 
        e."LastName" "EmployeeLastName",
        c."ContactName" "CustomerName"
    FROM "Order" AS o
    JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    JOIN "Customer" AS c on c."Id" = o."CustomerId"
    WHERE o."Id" = 16608;
    ```

    * Can you query results returned by another query in the context of using joins to create a temporary table? You can use the results of another query in a new query. However, that is beyond the scope of what's being taught. 


    E. Let's revert the code back to just a single join. Let's say that Ann no longer works for the company. The company goes in and deletes her name from the database in the Employees table. 

    * What's going to happen to all the rows that reference that employee? What happens to the OrderDetail rows? Will those orders get deleted along with her? Probably not; they shouldn't.

    * If you run your SQL statement again, you'll get an empty result. Not even the order data gets returned. 

    ```
    SELECT 
        o."Id", 
        e."FirstName" "EmployeeFirstName", 
        e."LastName" "EmployeeLastName"
    FROM "Order" AS o
    JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    WHERE o."Id" = 16608;
    ```

    * The order still exists, it's just not in our database. But the employee no longer exists, as expected. 

    * Since there's not a matching row on both sides of the join so nothing gets returned.
        
        * This is because the default JOIN in SQL is called an "Inner Join." If keys don't match on both sides of the join - the join condition (ON ...) was not met - then it doesn't show anything. Nothing gets returned. That's the rule with Inner Join.

    * There are [different types of joins](http://www.sql-join.com/sql-join-types). What it comes down to is: what side of the join is allowed to be empty or null?
        
        * The default one is called **Inner Join** if we don't specify a specific type of join. Results only get returned if both sides have something. 

        * **Left Join** - Returns all the rows in the first table even if the right table does not have any matching rows. 

        * SQLite Does Not Fully Support these:
            
            * **Right Join** - Opposite of Left Join.

            * **Full Join** - allows either side to be missing. 

    * We can specify the type by prefixing JOIN with the type. Since the default join doesn't return any results, let's specify Left Join. When you run it, the Employee Name columns are empty but you do see the order details. 
    
    ```
    SELECT 
        o."Id", 
        e."FirstName" "EmployeeFirstName", 
        e."LastName" "EmployeeLastName"
    FROM "Order" AS o
    LEFT JOIN "Employee" AS e ON e."Id" = o."EmployeeId"
    WHERE o."Id" = 16608;
    ```

### Code Along!

```
1:18:30
```

1. Get the Project started. This is a simple API with users and posts.

    * Install npm. 
    
    * Start the project with `npm run server`

    * Open Insomnia. Make a test request to `/users`. It should return a list of 3 users. 

        ```
        GET http://localhost:4000/users
        ```

    * Open the `blog.db3` database file just so we can see what's in that database. 

        * Users Table

            * Id

            * Username

        * Posts Table

            * Id

            * Contents

            * User Id - the foreign key
        
    * Create an endpoint that lists out all posts for a user. You will need to create a new file (`posts-router.js`) to separate it from the users router. 

    ```
    const express = require(express)
    const db = require("../data/config")

    const router = express.Router()
    
    router.get("/", async (req, res, next) => {
        try {
            const posts = await db("posts").where("user_id", req.params.id)
            res.json(posts)
        } catch(err) {
            next(err)
        }
    })

    module.exports = router
    ```

    * Instead of importing posts router into the index file, import it into the users router. It'll be a sub-router of a sub-router. Don't forget to use it in the file and attach the postRouter. 

    ```
    const express = require(express)
    const postRouter = require("../posts/post-router")
    const db = require("../data/config")

    const router = express.Router()

    router.use("/:id/posts", postRouter)
    ```

    * If you make your GET request now, you will get an error in the terminal. `ERROR: Undefined binding(s) detected when compiling SELECT`. Usually, this error just means that something you're passing into knex is undefined. In the `post-router` file, the where is probably undefined at `req.params.id`.

        * When you define a parameter on a parent router (`users-router`), those values do not explictly get passed down to the children routers.

        * To fix this, go into the parent router (`users-router`) and give it an option to define it. You'll want to merge the params and set them to true. 

        * You can read more about it on the [express.Router([options])](https://expressjs.com/en/api.html#express.router) section of Express Documentation.
        
        ```
        const router = express.Router({
            mergeParams: true,
        })
        ```

        * Try running the request again. You will now see a list of posts for a specific user. 