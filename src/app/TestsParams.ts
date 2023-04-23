
// export enum AnswerTypes { "options", "boolean", "oneword" }

export interface OptionsType {

    "options": { 'value': string }[],
    "correct_answer": number,

}

export interface BooleanType {

    "correct_answer": boolean,

}

export interface OnewordType {

    "correct_answer": string,

}

export interface Question {

    "body": string,
    "marks": {
        "positive": number,
        "negative": number
    },
    "answer_type": "options" | "boolean" | "oneword",
    "images": { 'src' : string, 'label' : string } [],
    "answer_content": OptionsType | BooleanType | OnewordType | any,
    "isMarked": boolean, // NEW ADDED
    "userAnswer": number | boolean | string // NEW ADDED // This is just a temp variable for binding value to the ui

}

export interface Test {

    "_id": string,
    "title": string,
    "description": string,
    "time": number,
    "marks": number,
    "is_without_time": boolean,
    "isActive": boolean,
    "details": {
        "added_by": string,
        "added_on": string
    },
    "questions": Question[]

}

export interface PracticePaper {

    "_id": string,
    "title": string,
    "description": string,
    "time": number,
    "marks": number,
    "is_without_time": boolean,
    "isActive": boolean,
    "details": {
        "added_by": string,
        "added_on": string
    },
    "questions": Question[]

}

class TestsParams {





}