import { DataTypes, Op } from 'sequelize';
import { db } from './db.js';

export const ForecastHourly = db.define('ForecastHourly', {
  zip: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      is: {
        args: /^\d{5}$/,
        msg: 'invalid ZIP',
      },
      notEmpty: true,
    },
  },
  timestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      isInt: {
        args: true,
        msg: 'invalid timestamp',
      },
    },
  },
  windSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isFloat: {
        args: true,
        msg: 'invalid windSpeed',
      },
    },
  },
  windDirection: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: true,
      is: {
        args: /^[NSEW]+$/,
        msg: 'invalid windDirection',
      },
    },
  },
  windDegree: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      isInt: {
        min: 0,
        max: 359,
      },
    },
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        args: true,
        msg: 'invalid temperature',
      },
    },
  },
  skies: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

ForecastHourly.getByZipAndTimestamp = async function (zip, timestamp, maxAge) {
  const topOfHour = timestamp - (timestamp % 3600);
  const where = {
    zip,
    timestamp: topOfHour,
  };

  if (maxAge) {
    const now = Date.now();
    const threshold = now - maxAge * 1000;
    where.updatedAt = {
      [Op.gt]: threshold,
    };
  }

  const order = [['updatedAt', 'DESC']];

  return ForecastHourly.findOne({ where, order });
};