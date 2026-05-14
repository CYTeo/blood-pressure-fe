import styles from "./reminder.module.scss";

import { ReminderContainer } from "./_components/ReminderContainer";

const ReminderPage = async () => {
  return (
    <div className={styles.reminderPage}>
      <ReminderContainer />
    </div>
  );
};

export default ReminderPage;
