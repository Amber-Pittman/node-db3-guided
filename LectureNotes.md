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
        SELECT "OrderDetail"."Id", "OrderDetail"."Quantity", "Product"."ProductName" FROM "OrderDetail" 
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

    * 