export declare enum MaterialStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum Semester {
    FIRST = "first",
    SECOND = "second"
}
export declare enum MaterialType {
    LECTURE_NOTE = "lecture_note",
    TEXTBOOK = "textbook",
    RESEARCH_PAPER = "research_paper",
    ASSIGNMENT = "assignment",
    PROJECT_REPORT = "project_report",
    EXAM_PAST_QUESTION = "exam_past_question",
    LAB_MANUAL = "lab_manual",
    STUDY_GUIDE = "study_guide",
    PRESENTATION_SLIDES = "presentation_slides",
    ARTICLE = "article",
    CASE_STUDY = "case_study",
    THESIS = "thesis",
    DISSERTATION = "dissertation",
    TUTORIAL_VIDEO = "tutorial_video",
    REFERENCE_MATERIAL = "reference_material"
}
export declare enum AcademicLevel {
    ONE_HUNDRED = "100",
    TWO_HUNDRED = "200",
    THREE_HUNDRED = "300",
    FOUR_HUNDRED = "400",
    FIVE_HUNDRED = "500",
    SIX_HUNDRED = "600"
}
export declare class CreateMaterialDto {
    name: string;
    description: string;
    comment?: string;
    fileUrl: string;
    academicLevel: AcademicLevel;
    semester: Semester;
    materialType: MaterialType;
}
