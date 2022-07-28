import { PrismaClient, Job, User } from "@prisma/client";
import { HttpException } from "src/exceptions/HttpException";

const jobs = new PrismaClient().job;

export interface JobDto {
  title: string;
  description: string;
  rate: number;
  approved: boolean;
  status: string;
  userId: number;
}

export const findJobByRole = async (user: User | undefined): Promise<Job[]> => {
  const allJob: Job[] =
    user?.role === "admin" || user?.role === "freelancer"
      ? await jobs.findMany()
      : user?.role === "client"
      ? await jobs.findMany({ where: { user: { is: { name: "Tey" } } } })
      : [];
  return allJob;
};

export const createJob = async (jobData: JobDto): Promise<Job> => {
  const createJobData = await jobs.create({
    data: { ...jobData },
  });
  return createJobData;
};

export const updateJob = async (
  jobId: number,
  jobData: { title: string; description: string }
): Promise<Job> => {
  const findJob = await jobs.findUnique({
    where: { id: jobId },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  const updateJobData = await jobs.update({
    where: { id: jobId },
    data: { ...jobData },
  });

  return updateJobData;
};

export const findJob = async (jobId: number): Promise<Job> => {
  const findJob = await jobs.findUnique({
    where: { id: jobId },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  return findJob;
};

export const deleteJob = async (jobId: number): Promise<Job> => {
  const findJob = await jobs.findUnique({
    where: { id: jobId },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  return findJob;
};
