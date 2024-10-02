import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Fade } from "react-awesome-reveal";
import { Content, ContentSection, Link } from './styles';
import { SvgIcon } from "../../common/SvgIcon";

interface Defect {
    defectType: string;
    subkind: string;
    message: string;
}

interface Story {
    id: number;
    text: string;
    defects: Defect[] | null;
}

interface AnalysisResult {
    userStory: string;
    defects: Defect[];
}

interface UserStoryAnalysisProps {
    id?: string;
}

const UserStoryAnalysis: React.FC<UserStoryAnalysisProps> = ({ id }) => {
    const [stories, setStories] = useState<Story[]>([
        { id: Date.now(), text: '', defects: null },
    ]);
    const [focusStoryId, setFocusStoryId] = useState<number | null>(null);
    const [hasDuplicates, setHasDuplicates] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const checkForDuplicates = () => {
        const texts = stories
            .map((story) => story.text.trim())
            .filter((text) => text !== '');
        const uniqueTexts = new Set(texts);
        if (uniqueTexts.size !== texts.length) {
            setHasDuplicates(true);
            setErrorMessage('Duplicate user stories found. Please remove duplicates.');
        } else {
            setHasDuplicates(false);
            setErrorMessage('');
        }
    };

    useEffect(() => {
        // Check for duplicates whenever stories change
        checkForDuplicates();

        // Focus the new textarea if a new story has been added
        if (focusStoryId !== null) {
            const textarea = document.getElementById(`story-${focusStoryId}`);
            if (textarea) {
                (textarea as HTMLTextAreaElement).focus();
            }
            setFocusStoryId(null); // Reset after focusing
        }
    }, [stories, focusStoryId, checkForDuplicates]);

    const handleAddStory = () => {
        const newStory = { id: Date.now(), text: '', defects: null };
        setStories([...stories, newStory]);
        setFocusStoryId(newStory.id);
    };

    const handleRemoveStory = (id: number) => {
        setStories(stories.filter((story) => story.id !== id));
    };

    const handleChange = (id: number, value: string) => {
        setStories(
            stories.map((story) =>
                story.id === id ? { ...story, text: value } : story
            )
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: number) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            handleAddStory();
        }
    };

    const handleAnalyse = async () => {
        try {
            const payload = stories
                .filter((story) => story.text.trim() !== '')
                .map((story) => ({ Id: story.id, StoryText: story.text }));

            // @ts-ignore
            const response = await axios.post<AnalysisResult[]>(
                'http://localhost:8080/api/UserStories/analyze',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const updatedStories = stories.map((story) => {
                const apiResponse = response.data.find(
                    (res: { id: number }) => res.id === story.id
                );
                return {
                    ...story,
                    defects: apiResponse ? apiResponse.defects : null,
                };
            });
            setStories(updatedStories);
        } catch (error) {
            console.error('Error analyzing stories:', error);
        }
    };

    return (
        <ContentSection id={id}>
            <Fade direction="left" triggerOnce fraction={0.3}>
                <Row justify="space-between" align="middle">
                    <Col lg={11} md={11} sm={12} xs={24}>
                        <SvgIcon
                            src={"waving.svg"}
                            width="100%"
                            height="100%"
                        />
                    </Col>
                    <Col lg={11} md={11} sm={24} xs={24}>
                        <h2>User Story Analysis</h2>
                        <Content>
                            Insert your user stories to test them for defects. Tip: Use "Tab" after each user story.
                            <br/>
                            This will use the AQUSA-core module described <Link
                            href="https://github.com/RELabUU/aqusa-core">
                            here
                        </Link> to look for User Story Defects.
                        </Content>
                        {stories.map((story) => (
                            <div key={story.id} style={{marginBottom: '20px'}}>
                                <Row gutter={[16, 16]} align="top">
                                    <Col span={24}>
                                        <div style={{display: 'flex', alignItems: 'flex-start'}}>
                                            <Input.TextArea
                                                id={`story-${story.id}`}
                                                placeholder="Enter your user story"
                                                value={story.text}
                                                onChange={(e) => handleChange(story.id, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, story.id)}
                                                style={{flex: 1}}
                                                autoSize={{minRows: 2, maxRows: 6}}
                                            />
                                            <Button
                                                type="text"
                                                icon={<CloseOutlined/>}
                                                onClick={() => handleRemoveStory(story.id)}
                                                style={{
                                                    marginLeft: '8px',
                                                    color: '#999',
                                                    padding: 0,
                                                    marginTop: '4px',
                                                }}
                                            />
                                        </div>
                                        {story.defects && story.defects.length > 0 && (
                                            <div
                                                style={{
                                                    backgroundColor:
                                                        story.defects.length === 1 && story.defects[0].defectType === 'None'
                                                            ? '#d4edda'
                                                            : '#f8d7da',
                                                    padding: '10px',
                                                    marginTop: '5px',
                                                    marginRight: '40px',
                                                }}
                                            >
                                                {story.defects.length === 1 && story.defects[0].defectType === 'None' ? (
                                                    <span>✅ No defects found</span>
                                                ) : (
                                                    <>
                                                        <span>❌ Defects found:</span>
                                                        {story.defects.map((defect, idx) => (
                                                            <div key={idx}
                                                                 style={{marginLeft: '10px', marginTop: '5px'}}>
                                                                <div><strong>Message:</strong> {defect.message}</div>
                                                                <div><strong>Defect Type:</strong> {defect.defectType}
                                                                </div>
                                                                <div><strong>Subkind:</strong> {defect.subkind}</div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        ))}

                        <Button
                            type="dashed"
                            onClick={handleAddStory}
                            style={{width: '100%', marginTop: '10px'}}
                        >
                            Add another story
                        </Button>
                            <Button
                                type="primary"
                                onClick={handleAnalyse}
                                disabled={hasDuplicates}
                                style={{width: '100%', marginTop: '10px'}}
                            >
                                Analyze
                            </Button>
                        {errorMessage && (
                            <div style={{color: 'red', marginTop: '10px', textAlign: 'center'}}>
                                    {errorMessage}
                                </div>
                            )}
                    </Col>
                </Row>
            </Fade>
        </ContentSection>
    );
};

export default UserStoryAnalysis;
