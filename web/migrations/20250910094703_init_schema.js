exports.up = function(knex) {
    return knex.schema
        .createTable("users", (table) => {
                table.increments("id").primary();
                table.string("username").notNullable().unique();
                table.string("password_hash").notNullable();
                table.string("role").defaultTo("viewer"); // viewer / admin
                table.timestamp("created_at").defaultTo(knex.fn.now());
        })
        .createTable("settings", (table) => {
            table.increments("id").primary();
            table.jsonb("urls").notNullable();       // list of URLs used for testing
            table.integer("interval").defaultTo(5);  // minutes (schedule setting)
            table.timestamp("created_at").defaultTo(knex.fn.now());
        })
        .createTable("test_results", (table) => {
            table.increments("id").primary();
            table.timestamp("started_at").defaultTo(knex.fn.now()); // test start date/time
            table.string("url").notNullable();        // actual link used (selected from list)
            table.string("mode").notNullable();       // download / upload
            table.bigInteger("file_size_bytes");      // file size
            table.integer("response_time_ms");        // total loading time
            table.bigInteger("speed_bps");            // speed in bytes/sec
            table.string("status").notNullable();     // success / fail
            table.text("error_msg");                  // error message if failed
            table.string("src_ip");                   // source IP
            table.string("dst_ip");                   // destination IP
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists("test_results")
        .dropTableIfExists("settings")
        .dropTableIfExists("users");
};
