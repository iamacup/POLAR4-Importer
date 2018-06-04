### What is this?

Converts the POLAR4 CSV (available here: https://www.officeforstudents.org.uk/data-and-analysis/polar-participation-of-local-areas/polar4-data/) into ArangoDB documents with the document _key property as the postcode for easy lookup

### How do i run it

```bash
npm install
npm start DATABASEPASSWORD
```

### What it assumed

 * Expects a local ArangoDB instance on port 8529
 * Expects database 'dump' to exist
 * Expects use of the 'root' user with access to database 'dump' with DATABASEPASSWORD passed as argument 
 * Expects a collection called polarPostcodes to exist
