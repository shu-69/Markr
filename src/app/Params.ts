export class Params {
  public static MAX_PROFILE_IMAGE_SIZE_IN_KB = 120;

  public static SERVICE_BASE_URL = 'https://markr-api.onrender.com';

  public static RAZORPAY_KEY = 'rzp_live_UFkoWsGcg8ZqWp'; // Swap this with your rzp_live_... key for Live Mode

  public static ACCOUNT_SERVICE_URL_SUFFIXS = {
    CHECK_EMAIL_EXISTS: '/accounts/checkEmailExists',
    REGISTER: '/accounts/register',
    LOGIN: '/accounts/authenticate',
    UPDATE_PROFILE: '/accounts/updateProfile',
    SAVE_TRANSACTION: '/accounts/saveTransaction',
    GET_TRANSACTIONS: '/accounts/getTransactions',
  };

  public static EXAM_SERVICE_URL_SUFFIXS = {
    CREATE_TEST: '/exams/createTest',
    CREATE_PRACTICE_PAPER: '/exams/createPracticePaper',
    GET_TESTS: '/exams/getTests',
    GET_ACTIVE_TESTS: '/exams/getActiveTests',
    GET_ACTIVE_PRACTICE_PAPERS: '/exams/getActivePracticePapers',
    TOGGLE_EXAM_STATUS: '/exams/toggleExamStatus',
    GET_EXAM: '/exams/getExam',
    UPDATE_EXAM: '/exams/updateExam',
    DELETE_EXAM: '/exams/deleteExam',
    GET_EXAM_INSTRUCTIONS: '/exams/getExamInstructions',
    SUBMIT_EXAM: '/exams/submitExam',
    GET_SUBMISSION: '/exams/getSubmission',
    CHECK_SUBMISSION: '/exams/checkSubmissionExists',
  };

  public static USER_SERVICE_URL_SUFFIXS = {
    GET_SUBMISSIONS: '/users/getSubmissions',
  };

  public static COURSES_SERVICE_URL_SUFFIXS = {
    GET_COURSES: '/courses/getCourses',
    ENROLL_IN_COURSE: '/courses/enroll',
    GET_ENROLLED_COURSES: '/courses/getEnrolled',
  };

  public static PageTitles = {
    register: 'CrecomOnline Registration',
  };

  public static PageNames = {
    login: 'login',
    home: 'home',
    dashboard: 'dashboard',
    courses: 'courses',
    tests: 'tests',
    practice_papers: 'practice-papers',
    exam: 'exam',
    viewresult: 'viewresult',
  };
}
