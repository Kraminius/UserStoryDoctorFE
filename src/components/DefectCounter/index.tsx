
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import { ContentSection, CounterWrapper, ContentWrapper, StyledRow } from './styles';

interface DefectLogEntry {
    id: string;
    date: string;
    defectCount: number;
}

const Index: React.FC = () => {
    const [totalDefects, setTotalDefects] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDefectLogs = async () => {
            try {
                const response = await axios.get('/api/userstories/defectlogs');
                const logs = response.data as DefectLogEntry[];

                // Calculate the total number of defects from the logs
                const total = logs.reduce((sum, log) => sum + log.defectCount, 0);
                setTotalDefects(total);
            } catch (error) {
                console.error('Error fetching defect logs:', error);
                setTotalDefects(0);
            } finally {
                setLoading(false);
            }
        };

        fetchDefectLogs();
    }, []);

    if (loading) {
        return (
            <CounterWrapper>
                <Spin size="large" />
            </CounterWrapper>
        );
    }

    return (

                <ContentWrapper>
                    {loading ? (
                        <CounterWrapper>
                            <Spin size="large" />
                        </CounterWrapper>
                    ) : (
                        <CounterWrapper>
                            <h1>
                                <span className="defect-count">{totalDefects}</span> Defects found in user stories to this day
                            </h1>
                        </CounterWrapper>

                    )}
                </ContentWrapper>

    );
};

export default Index;
