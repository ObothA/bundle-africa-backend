import { RequestHandler } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

import ErrorResponse from '../utils/errorResponse';
import processLineByLine from '../utils/readLineByLine';

type Reward = {
  customerId: string;
  customerName: string;
  voucherAmount: number;
  voucherValidityDays: number;
};
const rewardCalculator = (linesArr: string[]): Reward[] => {
  const rewards: Reward[] = [];

  for (const line of linesArr) {
    const splitLine = line.split(',');
    const orderValue: number = +splitLine[2];
    const temp: Reward = {
      customerId: splitLine[0],
      customerName: splitLine[1],
      voucherAmount: 0,
      voucherValidityDays: 0,
    };

    if (orderValue >= 1000 && orderValue < 5000) {
      temp.voucherAmount = 100;
      temp.voucherValidityDays = 1;
      rewards.push(temp);
    } else if (orderValue >= 5000 && orderValue < 10000) {
      temp.voucherAmount = 500;
      temp.voucherValidityDays = 5;
      rewards.push(temp);
    } else if (orderValue >= 10000) {
      temp.voucherAmount = 1000;
      temp.voucherValidityDays = 10;
      rewards.push(temp);
    }
  }

  return rewards;
};

export const readCsv: RequestHandler = (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file.', 400));
  }

  const file = req.files.file as UploadedFile;
  const filetype = file.mimetype;

  if (!filetype.endsWith('csv')) {
    return next(new ErrorResponse('Please upload a CSV file.', 400));
  }

  const filePath = './assets/file.csv';
  file.mv(filePath, async (err) => {
    if (err) {
      return next(new ErrorResponse(err, 400));
    } else {
      try {
        const linesArray = await processLineByLine(filePath);
        const rewards = rewardCalculator(linesArray.slice(1));
        fs.unlinkSync(filePath);
        return res.status(200).json({
          rewards,
        });
      } catch (error) {
        return next(new ErrorResponse('Server Error', 500));
      }
    }
  });
};
