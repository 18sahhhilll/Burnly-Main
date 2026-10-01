export const PRESET_SCENARIOS = [
  {
    id: 'preset-seed',
    title: 'Seed Stage Startup',
    data: {
      startingCash: 1500000,
      monthlyRevenue: 25000,
      revenueGrowthRate: 8, // 8% monthly growth
      payrollSpend: 45000,
      marketingSpend: 12000,
      infrastructureSpend: 4000,
      opsSpend: 5000,
      founderSalary: 10000,
      hiringTimeline: [
        { id: 'h1', role: 'Senior Full Stack Engineer', startMonth: 3, count: 1, monthlySalary: 12000 },
        { id: 'h2', role: 'Growth Marketer', startMonth: 6, count: 1, monthlySalary: 9000 },
        { id: 'h3', role: 'Frontend Engineer', startMonth: 9, count: 2, monthlySalary: 10000 },
      ],
    },
  },
  {
    id: 'preset-bootstrapped',
    title: 'Bootstrapped & Lean',
    data: {
      startingCash: 250000,
      monthlyRevenue: 35000,
      revenueGrowthRate: 5,
      payrollSpend: 15000,
      marketingSpend: 3000,
      infrastructureSpend: 1500,
      opsSpend: 2000,
      founderSalary: 6000,
      hiringTimeline: [
        { id: 'h1', role: 'Customer Support Rep', startMonth: 6, count: 1, monthlySalary: 4500 },
      ],
    },
  },
  {
    id: 'preset-series-a',
    title: 'Aggressive Scale-Up',
    data: {
      startingCash: 5000000,
      monthlyRevenue: 120000,
      revenueGrowthRate: 12,
      payrollSpend: 180000,
      marketingSpend: 50000,
      infrastructureSpend: 18000,
      opsSpend: 15000,
      founderSalary: 15000,
      hiringTimeline: [
        { id: 'h1', role: 'Engineering Lead', startMonth: 2, count: 1, monthlySalary: 16000 },
        { id: 'h2', role: 'Account Executive', startMonth: 3, count: 3, monthlySalary: 10000 },
        { id: 'h3', role: 'DevOps Specialist', startMonth: 5, count: 1, monthlySalary: 14000 },
        { id: 'h4', role: 'Product Manager', startMonth: 8, count: 2, monthlySalary: 13000 },
      ],
    },
  },
];
