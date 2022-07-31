import { PrismaClient, Application, User, Job } from "@prisma/client";
import { HttpException } from "src/exceptions/HttpException";
import { applicationDto } from "src/interfaces/application.interface";

const applications = new PrismaClient().application;
const jobs = new PrismaClient().job;

export const createApplication = async (
  applicationData: applicationDto
): Promise<Application> => {
  const createApplicationData = await applications.create({
    data: { ...applicationData },
  });

  return createApplicationData;
};

export const getApplicationByRole = async (
  user: User | undefined
): Promise<Application[]> => {
  const applicationData =
    user?.role === "admin"
      ? await applications.findMany()
      : user?.role === "freelancer"
      ? await applications.findMany({
          where: { userId: user?.id },
        })
      : [];
  return applicationData;
};

export const answerApplication = async (
  applicationId: number,
  answer: string
): Promise<Job> => {
  const answerApplicationData = await applications.update({
    where: { id: applicationId },
    data: { answer, answered: true },
  });

  const findJobData = await jobs.findUnique({
    where: { id: answerApplicationData.jobId },
    include: { Application: true },
  });

  if (!findJobData) throw new HttpException(409, "Not found job");

  return findJobData;
};
