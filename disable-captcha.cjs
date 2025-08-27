const mysql = require('mysql2');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Aa@123456',
  database: 'vivy-nest-admin'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
  
  // Update the captcha configuration
  const query = "UPDATE sys_config SET config_value = 'false' WHERE config_key = 'sys.account.enableCaptcha'";
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating captcha configuration:', error);
      connection.end();
      return;
    }
    
    console.log('Captcha configuration updated successfully');
    console.log('Rows affected:', results.affectedRows);
    
    // Close the connection
    connection.end();
  });
});