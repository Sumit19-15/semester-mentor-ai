import cron from 'node-cron';
import User from '../models/userModel.js';
import StudyPlan from '../models/StudyPlanModel.js';
import { sendDailyStudyPlanEmail } from './emailService.js';

export const startCronJobs = () => {
  // Check if credentials exist
  if (!process.env.GMAIL_USER_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error('⚠️  GMAIL_USER_EMAIL or GMAIL_APP_PASSWORD is not set. Daily email cron jobs are disabled.');
    return;
  }

  // Run every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily study plan email job at 8:00 AM');
    try {
      const users = await User.find({});
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const user of users) {
        // Fetch all active study plans for the user
        const activePlans = await StudyPlan.find({
          user: user._id,
          isCompleted: false,
          startDate: { $lte: new Date() }
        });

        if (!activePlans.length) continue;

        let planHtml = '';
        let hasTasksForToday = false;

        for (const plan of activePlans) {
          const planData = plan.planData?.plan || plan.planData;
          if (!planData || !planData.daily) continue;

          // Find today's tasks
          const start = new Date(plan.startDate);
          start.setHours(0, 0, 0, 0);

          const diffTime = Math.abs(today - start);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          const todaysTasks = planData.daily[diffDays];

          if (todaysTasks) {
            hasTasksForToday = true;
            planHtml += `<h3>Subject: ${todaysTasks.subject || plan.name}</h3>`;
            if (todaysTasks.topics && todaysTasks.topics.length) {
              planHtml += `<ul>${todaysTasks.topics.map(t => `<li>${t}</li>`).join('')}</ul>`;
            }
            if (todaysTasks.tasks && todaysTasks.tasks.length) {
              planHtml += `<p><strong>Tasks:</strong></p><ul>${todaysTasks.tasks.map(t => `<li>${t}</li>`).join('')}</ul>`;
            }
            if (todaysTasks.revision) {
              planHtml += `<p><strong>Revision:</strong> ${todaysTasks.revision}</p>`;
            }
          }
        }

        if (hasTasksForToday) {
          await sendDailyStudyPlanEmail(user.email, user.name, planHtml);
        }
      }
    } catch (error) {
      console.error('Error running daily cron job:', error);
    }
  });

  console.log('Cron jobs initialized successfully.');
};
