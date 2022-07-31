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
  company_scale: string;
  company_tips: string;
  job_info: string;
  created_at: Date;
}

export const findJobByRole = async (user: User | undefined): Promise<Job[]> => {
  const allJob: Job[] =
    user?.role === "admin"
      ? await jobs.findMany({
          include: {
            Application: true,
          },
          orderBy: {
            created_at: "desc",
          },
        })
      : user?.role === "freelancer"
      ? await jobs.findMany({
          where: { approved: true },
          include: {
            Application: {
              where: {
                user: {
                  is: {
                    id: user?.id,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        })
      : user?.role === "client"
      ? await jobs.findMany({
          where: { user: { is: { name: user?.name } } },
          include: {
            Application: true,
          },
          orderBy: {
            created_at: "desc",
          },
        })
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
    include: {
      Application: {
        include: { user: true },
      },
    },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  return findJob;
};

export const deleteJob = async (jobId: number): Promise<Job> => {
  const findJob = await jobs.findUnique({
    where: { id: jobId },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  const deletedJobData = await jobs.delete({ where: { id: jobId } });

  return deletedJobData;
};

export const approveJob = async (jobId: number): Promise<Job[]> => {
  const findJob = await jobs.findUnique({
    where: { id: jobId },
  });

  if (!findJob) throw new HttpException(409, "Not job found");

  await jobs.update({
    where: { id: jobId },
    data: {
      approved: true,
    },
  });

  const allJobData = await jobs.findMany({
    include: {
      Application: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return allJobData;
};
