"use client";

import styles from "./bloodPressureContainer.module.scss";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Empty,
  Flex,
  message,
  Pagination,
  Skeleton,
} from "antd";
import Text from "antd/es/typography/Text";
import { AxiosError } from "axios";
import { EditOutlined } from "@ant-design/icons";

import { getBPList } from "@/services/api/bp";
import { formatDate } from "@/utils/helper";

export const BloodPressureContainer = () => {
  const router = useRouter();
  const [bloodPressure, setBloodPressure] = useState<any>({
    loading: true,
    data: [],
  });

  const fetchBloodPressure = async (selectedPage?: number) => {
    try {
      const res = await getBPList({
        page: selectedPage || 1,
        limit: 10,
        search: "",
      });
      setBloodPressure({ loading: false, ...res });
    } catch (err) {
      if (err instanceof AxiosError) message.error(err.response?.data);
    }
  };
  useEffect(() => {
    fetchBloodPressure();
  }, []);

  const BPCard = useMemo(() => {
    if (bloodPressure.loading && bloodPressure.data.length === 0) {
      return Array.from({ length: 5 }).map((_, index) => (
        <Skeleton.Node key={index} className={styles.skeletonNode} active />
      ));
    }

    if (bloodPressure.data.length === 0) {
      return <Empty></Empty>;
    }

    const sortedData = [...bloodPressure.data]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .reduce((acc: any[], item: any) => {
        const dateKey = formatDate(item.createdAt, "YYYY-MM-DD");
        const existingGroup = acc.find(
          (g: any) => formatDate(g.createdAt, "YYYY-MM-DD") === dateKey,
        );

        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          acc.push({
            createdAt: item.createdAt,
            data: [item],
          });
        }
        return acc;
      }, []);

    const cards = sortedData.map((group: any) => (
      <Card
        key={group.createdAt}
        size="small"
        title={<Text>{formatDate(group.createdAt, "DD MMM YYYY")}</Text>}
        classNames={{
          header: styles.cardHeader,
        }}
      >
        {group.data.map((item: any) => (
          <Flex
            key={item.id}
            justify="space-between"
            align="start"
            className={styles.cardItem}
          >
            <div>
              <Text strong>{item.systolic}</Text> / {item.diastolic} mmHg
              <div className={styles.timeLabel}>
                {formatDate(item.createdAt, "hh:mm a")}
              </div>
            </div>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                router.push(`/blood-pressure/${item.id}`);
              }}
            />
          </Flex>
        ))}
      </Card>
    ));

    return cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloodPressure]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>{BPCard}</div>
      {bloodPressure?.meta?.total > 10 && (
        <Pagination
          align="center"
          current={bloodPressure?.meta?.page}
          total={bloodPressure?.meta?.total}
          pageSize={bloodPressure?.meta?.limit}
          showTotal={(total) => `Total ${total} items`}
          onChange={(page) => {
            fetchBloodPressure(page);
          }}
          className={styles.pagination}
        />
      )}
    </div>
  );
};
