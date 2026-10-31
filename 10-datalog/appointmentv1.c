#include <stdio.h>
#include <sqlite3.h>
#include <string.h>

// Callback function called for each row of results.
int printresults(void * s, int argc, char** argv, char** colname){
	s = 0;
	printf("Match found:\n");
	for (int i = 0; i < argc; i++) {
        	printf("%s = %s\n", colname[i], argv[i] ? argv[i] : "NULL");
    	}
    	printf("\n");
	return 0;
}

int main(void){
	sqlite3 *db;
	char appointmentID[7];
	char sql[100];
	int loop = 1;
	
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
			//Creating a SQL statement with user input... what could
			//go wrong?
			sprintf(sql, "SELECT * FROM Appointment WHERE AppointmentID = %s;", appointmentID);
			sqlite3_exec(db, sql, printresults, 0, NULL);
		}
	}

	//Close database connection
	sqlite3_close(db);
	return 0;
}
