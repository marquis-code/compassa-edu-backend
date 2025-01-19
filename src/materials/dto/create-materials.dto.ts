import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MaterialStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Semester {
  FIRST = 'first',
  SECOND = 'second',
}

export enum MaterialType {
  LECTURE_NOTE = 'lecture_note',
  TEXTBOOK = 'textbook',
  RESEARCH_PAPER = 'research_paper',
  ASSIGNMENT = 'assignment',
  PROJECT_REPORT = 'project_report',
  EXAM_PAST_QUESTION = 'exam_past_question',
  LAB_MANUAL = 'lab_manual',
  STUDY_GUIDE = 'study_guide',
  PRESENTATION_SLIDES = 'presentation_slides',
  ARTICLE = 'article',
  CASE_STUDY = 'case_study',
  THESIS = 'thesis',
  DISSERTATION = 'dissertation',
  TUTORIAL_VIDEO = 'tutorial_video',
  REFERENCE_MATERIAL = 'reference_material',
}

export enum AcademicLevel {
  ONE_HUNDRED = '100',
  TWO_HUNDRED = '200',
  THREE_HUNDRED = '300',
  FOUR_HUNDRED = '400',
  FIVE_HUNDRED = '500',
  SIX_HUNDRED = '600',
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}


export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString({ each: true })
  @IsNotEmpty()
  fileUrls: string[];

  @IsString()
  @IsOptional()
  status?: string;

  @IsEnum(AcademicLevel)
  @IsNotEmpty()
  academicLevel: AcademicLevel;

  @IsEnum(Semester)
  @IsNotEmpty()
  semester: Semester;

  @IsEnum(MaterialType)
  @IsNotEmpty()
  materialType: MaterialType;

  @IsString()
  @IsNotEmpty()
  category: string; // Category ID

  @IsString()
  @IsNotEmpty()
  session: string; // Session ID
}
