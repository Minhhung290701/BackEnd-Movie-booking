# Contract Management Service

Provides services about contract management

## Installation

### install packages

```
npm install
// yarn install

// install swagger-cli to generate docs
npm install -g swagger-cli
```

## Configuration

For each environment, make a copy file default.env and change the name to:

-   development.env for develop on local
-   staging.env for testing environment
-   production.env for production environment

Update configurations on the new environment file.

## Running

```
npm run generate-docs
// yarn generate-docs

// local
npm run dev
// yarn dev

// staging
npm run staging
// yarn staging

// production
npm start
// yarn start

```

## Database

### indexing

db.users.createIndex({username: 1}, {unique: true});
db.users.createIndex({email: 1}, {unique: true});
db.users.createIndex({code: -1}, { unique: true})
db.users.createIndex({templateId: 1});
db.users.createIndex({subject: 1});
db.users.createIndex({status: 1});
db.users.createIndex({createdAt: 1});

db.faqLikes.createIndex({ userId: 1, faqId: 1 }, { unique: true });

db.subject.createIndex({ code: 1 }, { unique: true });

db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ userId: 1, isRead: 1 });

db.learningProgresses.createIndex({ studentId: 1 });
db.learningProgresses.createIndex({ classId: 1 });
db.learningProgresses.createIndex({ subjectId: 1 });
db.learningProgresses.createIndex({ subjectUnitId: 1 })

db.subjectExtensions.createIndex({ createdAt: 1});

db.retentionRequests.createIndex({ createdAt: 1});

db.class.createIndex({subjectId: 1});
db.class.createIndex({isInvidual: 1})
db.class.createIndex({isDeleted: 1});

db.studentsInClasses.createIndex({subjectId: 1});
db.studentsInClasses.createIndex({classId: 1});
db.studentsInClasses.createIndex({studentId: 1});;
db.studentsInClasses.createIndex({isDeleted: 1});

db.trailerContents.createIndex({classId: -1, subjectUnitId: -1}, {unique: true});

db.survey.createIndex(({ studentId: 1, subjectUnitId: 1, classId: 1 }, { unique: true })

db.supportTicketTypes.createIndex(({ name: 1 }, { unique: true })
