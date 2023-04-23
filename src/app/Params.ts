export class Params{

    public static MAX_PROFILE_IMAGE_SIZE_IN_KB = 120;

    public static SERVICE_BASE_URL = "http://localhost:8081";

    public static ACCOUNT_SERVICE_URL_SUFFIXS = {
        "CHECK_EMAIL_EXISTS": "/accounts/checkEmailExists",
        "REGISTER": "/accounts/register",
        "LOGIN": "/accounts/authenticate"
    }

    public static EXAM_SERVICE_URL_SUFFIXS = {
        "CREATE_TEST": "/exams/createTest",
        "CREATE_PRACTICE_PAPER": "/exams/createPracticePaper",
        "GET_TESTS": "/exams/getTests",
        "GET_ACTIVE_TESTS": "/exams/getActiveTests",
        "TOGGLE_EXAM_STATUS": "/exams/toggleExamStatus",
        "GET_EXAM": "/exams/getExam",
        "UPDATE_EXAM": "/exams/updateExam",
        "DELETE_EXAM": "/exams/deleteExam",
        "GET_EXAM_INSTRUCTIONS": "/exams/getExamInstructions",
        "SUBMIT_EXAM": "/exams/submitExam"
    }

    public static PageTitles = {
        "register": 'CrecomOnline Registration'
    }

    public static PageNames = {
        "login": "login",
        "home": "home",
        "dashboard": "dashboard",
        "courses": "courses",
        "tests": "tests",
        "practice_papers": "practice-papers",
        "exam": "exam"
    }

}