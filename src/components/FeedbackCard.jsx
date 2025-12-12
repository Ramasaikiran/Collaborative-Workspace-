import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function FeedbackCard({ feedback }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="font-medium">{feedback.title}</div>
                <div className="text-sm text-gray-500">{feedback.message}</div>
            </CardContent>
        </Card>
    );
}
