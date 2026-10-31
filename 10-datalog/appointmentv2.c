#include <stdio.h>
#include <sqlite3.h>
#include <string.h>

int main(void){
	sqlite3 *db;
	sqlite3_stmt *stmt;
	char appointmentID[7];
	int loop = 1;
	int retval;
	
	//Create a connection to our database
	sqlite3_open("patients.db", &db);

	if (db == NULL){
		printf("Failed to open DB\n");
		return 1;
	}

	while (loop == 1){
		printf("Enter appointment ID (q to quit): \n");
		//Get user input
		fgets(appointmentID, sizeof(appointmentID), stdin);
		if (strcmp(appointmentID,"q\n") == 0){
			loop = 0;
		} else {
			//Use a prepared statement with '?' for input locations
			char *sql = "SELECT * FROM Appointment WHERE AppointmentID = ?";
			//Have the 'prepare' function prepare our statement 
			retval = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
			
			if (retval == SQLITE_OK){
				//Bind our user input to the parameter placement (1)
				//in the prepared SQL query.
				sqlite3_bind_text(stmt, 1, appointmentID, strlen(appointmentID), SQLITE_STATIC);
			}

			// Slightly different stmts processing (have to
			// 'step' through stmts).
			while (sqlite3_step(stmt) != SQLITE_DONE) {
				printf("Match found:\n");
				for (int i = 0; i < sqlite3_column_count(stmt); i++){
					printf("%s = %s\n", sqlite3_column_name(stmt, i), sqlite3_column_text(stmt, i));
				}
				printf("\n");
			}

			//Clear the prepared statement
			sqlite3_finalize(stmt);
		}
	}

	//Close database connection
	sqlite3_close(db);
	return 0;
}
