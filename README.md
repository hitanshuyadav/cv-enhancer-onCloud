# 🤖 AI CV Enhancer

An AI-powered CV/Resume analysis platform built using **AWS Serverless Architecture** and **Amazon Bedrock**.

The application allows a user to submit:

- 📄 Resume/CV
- 💼 Job Description

The system then analyzes the resume against the job description using **Amazon Bedrock** and provides useful feedback such as:

- ATS compatibility score
- Matching skills
- Missing skills
- Resume weaknesses
- Improvement recommendations
- Improved professional summary
- Final verdict

The project is designed using an **event-driven, asynchronous architecture**, where the resume is stored in Amazon S3, an S3 event triggers the AI analysis Lambda, and the final result is stored in DynamoDB.

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [How the Architecture Works](#-how-the-architecture-works)
- [AWS Services Used](#-aws-services-used)
- [Project Flow](#-project-flow)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Step 1: Create the S3 Bucket](#-step-1-create-the-s3-bucket)
- [Step 2: Create the DynamoDB Table](#-step-2-create-the-dynamodb-table)
- [Step 3: Create Lambda 1](#-step-3-create-lambda-1-storage-lambda)
- [Step 4: Configure S3 Event Notification](#-step-4-configure-s3-event-notification)
- [Step 5: Create Lambda 2](#-step-5-create-lambda-2-analyzer-lambda)
- [Step 6: Configure Amazon Bedrock](#-step-6-configure-amazon-bedrock)
- [Step 7: Create Lambda 3](#-step-7-create-lambda-3-result-lambda)
- [Step 8: Configure API Gateway](#-step-8-configure-api-gateway)
- [Step 9: Build the Frontend](#-step-9-build-the-frontend)
- [Step 10: Test the Application](#-step-10-test-the-application)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [IAM Permissions](#-iam-permissions)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)

---

# 🚀 Project Overview

Traditional resume screening can be difficult for candidates because they often don't know how well their resume matches a particular job description.

This project solves that problem using Generative AI.

The user provides a resume and a job description.

The system:

1. Receives the resume and job description.
2. Generates a unique request ID.
3. Stores the submitted information in Amazon S3.
4. S3 generates an `ObjectCreated` event.
5. The event triggers the Analyzer Lambda.
6. Analyzer Lambda reads the resume and job description from S3.
7. Lambda sends the information to Amazon Bedrock.
8. Bedrock generates an AI-powered analysis.
9. The analysis is stored in DynamoDB.
10. The frontend polls the Result API using the request ID.
11. Result Lambda retrieves the analysis from DynamoDB.
12. The frontend displays the result.

---

# ✨ Features

## Resume Analysis

The application analyzes a resume against a specific job description.

## ATS Compatibility

The AI estimates how well the resume matches the job description.

Example:

```text
ATS Compatibility Score: 82/100