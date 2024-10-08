import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Tabs, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Fade } from 'react-awesome-reveal';
import { Content, ContentSection, Link } from './styles';

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
    const [stories, setStories] = useState<Story[]>([{ id: Date.now(), text: '', defects: null }]); // Always have one story by default
    const [bulkStoryInput, setBulkStoryInput] = useState<string>(''); // For bulk input
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility
    const [hasDuplicates, setHasDuplicates] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activeTabKey, setActiveTabKey] = useState<string>('1'); // Track the active tab
    const [focusStoryId, setFocusStoryId] = useState<number | null>(null); // Track focus for new text area

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
        checkForDuplicates();

        // Focus the newly added textarea if a new story has been added
        if (focusStoryId !== null) {
            const textarea = document.getElementById(`story-${focusStoryId}`);
            if (textarea) {
                (textarea as HTMLTextAreaElement).focus();
            }
            setFocusStoryId(null); // Reset after focusing
        }
    }, [stories, focusStoryId]);

    const handleAddStory = () => {
        const newStory = { id: Date.now(), text: '', defects: null };
        setStories([...stories, newStory]); // Add new story to the stories list
        setFocusStoryId(newStory.id); // Set the focus to the newly added story's text area
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

    const handleBulkPaste = () => {
        const pastedStories = bulkStoryInput
            .split('\n')
            .map((text) => text.trim())
            .filter((text) => text !== '')
            .map((text, index) => ({ id: Date.now() + index, text, defects: null })); // Ensure IDs are integers

        setStories([...stories, ...pastedStories]);
        setBulkStoryInput('');
        setIsModalVisible(false); // Close the modal after adding stories
        setActiveTabKey('1'); // Automatically switch to the "Individual Stories" tab
    };


    const handleAnalyse = async () => {
        try {
            const payload = stories
                .filter((story) => story.text.trim() !== '')
                .map((story) => ({ Id: story.id, StoryText: story.text }));

            // Fetch the response from the API
            // @ts-ignore
            const response = await axios.post<AnalysisResult[]>(
                '/api/UserStories/analyze',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Ensure response.data contains the expected array of stories and defects
            const updatedStories = stories.map((story) => {
                const apiResponse = response.data.find(
                    (res: AnalysisResult) => res.userStory === story.text // Explicitly typed 'res'
                );
                return {
                    ...story,
                    defects: apiResponse ? apiResponse.defects : null, // Map defects back to the story
                };
            });

            // Set the updated stories back to state
            setStories(updatedStories);
        } catch (error) {
            console.error('Error analyzing stories:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, id: number) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            handleAddStory();
        }
    };


    // Defining tab items array
    const tabItems = [
        {
            key: '1',
            label: 'Individual Stories',
            children: (
                <>
                    {stories.map((story) => (
                        <div key={story.id} style={{ marginBottom: '20px' }}>
                            <Row gutter={[16, 16]} align="top">
                                <Col span={24}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <Input.TextArea
                                            id={`story-${story.id}`}
                                            placeholder="Enter your user story"
                                            value={story.text}
                                            onChange={(e) => handleChange(story.id, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, story.id)} // Handle "Tab" press to add new story
                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                            style={{ flex: 1 }}
                                        />
                                        {stories.length > 1 && (
                                            <Button
                                                type="text"
                                                icon={<CloseOutlined />}
                                                onClick={() => handleRemoveStory(story.id)}
                                                style={{
                                                    marginLeft: '8px',
                                                    color: '#999',
                                                    padding: 0,
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Render defects if any */}
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
                                                    <strong>❌ Defects found:</strong>
                                                    {story.defects.map((defect, idx) => (
                                                        <div key={idx} style={{ marginLeft: '10px', marginTop: '5px' }}>
                                                            <div>
                                                                <strong>Defect Type:</strong> {defect.defectType}
                                                            </div>
                                                            <div>
                                                                <strong>Subkind:</strong> {defect.subkind}
                                                            </div>
                                                            <div>
                                                                <strong>Message:</strong> {defect.message}
                                                            </div>
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
                        style={{ width: '100%', marginTop: '10px' }}
                    >
                        Add another story
                    </Button>
                </>
            ),
        },
        {
            key: '2',
            label: 'Bulk Insert',
            children: (
                <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    style={{ width: '100%', marginTop: '10px' }}
                >
                    Open Bulk Insert
                </Button>
            ),
        },
    ];

    return (
        <ContentSection id={id}>
            <Fade direction="left" triggerOnce fraction={0.3}>
                <Row justify="space-between" align="middle">
                    <Col lg={50} md={50} sm={24} xs={24}>
                        <h2>User Story Analysis</h2>
                        <Content>
                            Insert your user stories to test them for defects. Tip: You can add stories individually or use the bulk insert option.
                            <br />
                            This will use the AQUSA-core module described{' '}
                            <Link href="https://github.com/RELabUU/aqusa-core">here</Link> to look for User Story Defects.
                        </Content>

                        {/* Use the 'items' prop for tabs */}
                        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={tabItems} />

                        {/* Analyze Button */}
                        <Button
                            type="primary"
                            onClick={handleAnalyse}
                            disabled={hasDuplicates} // Fully disable button when duplicates exist
                            style={{
                                width: '100%',
                                marginTop: '10px',
                                backgroundColor: hasDuplicates ? '#d3d3d3' : '#18216D', // Greyed out when disabled
                                cursor: hasDuplicates ? 'not-allowed' : 'pointer', // Show "not allowed" cursor when disabled
                            }}
                        >
                            Analyze
                        </Button>

                        {errorMessage && (
                            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                                {errorMessage}
                            </div>
                        )}
                    </Col>
                </Row>
            </Fade>

            {/* Bulk Insert Modal */}
            <Modal
                title="Bulk Insert User Stories"
                open={isModalVisible}
                onOk={handleBulkPaste}
                onCancel={() => setIsModalVisible(false)}
                okText="Insert Stories"
            >
                <Input.TextArea
                    placeholder="Paste multiple user stories, each on a new line..."
                    value={bulkStoryInput}
                    onChange={(e) => setBulkStoryInput(e.target.value)}
                    autoSize={{ minRows: 5, maxRows: 10 }}
                />
            </Modal>
        </ContentSection>
    );
};

export default UserStoryAnalysis;
