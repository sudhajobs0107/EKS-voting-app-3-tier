# **3-Tier-Language-Vote-App Project :smile:**
## In this project we will deploy a 3-Tier-Language-Vote-App using AWS EKS.
![3-tier](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/3-tier.PNG)
___
# Prerequisites
### Before starting the project you should have these things in your system :-
>+ ### Account on AWS
>+ ### Account on GitHub
>+ ### Code (we will use code from this repository) : [click here for code](https://github.com/sudhajobs0107/EKS-voting-app-3-tier)
___
## STEP 1: Launch Instance
+ ### Create AWS EC2 instance
![Name](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/name.PNG)
![Launch](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/launch.PNG)
![Instance](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/instance.PNG)
+ ### Connect this instance through SSH
+ ### After successfully connecting to the EC2 instance, it will look like this
![Connect Interface](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/ssh.PNG)
___
## STEP 2: Git
+ ### Now clone git repo, for this use command as follow :-
```
git clone https://github.com/sudhajobs0107/EKS-voting-app-3-tier.git
```
![Git-Clone](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/git-clone.PNG)
___
## STEP 3: Build & Push API Image To ECR
+ ### Now we will build API image. So first we will install docker for this use command :-
```
sudo apt install docker.io -y
```
```
sudo usermod -aG docker $USER
```
```
sudo reboot
```
+ ### Now we will make **Dockerfile**, so go to API directory and write command :-
```
vim Dockerfile
```
+ ### Now write code as shown below :-
```
# Use an official Golang runtime as a parent image
FROM golang:1.17 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the local package files to the container's workspace
COPY go.mod .
COPY go.sum .

# Download and install any required dependencies
RUN go mod download

# Copy the rest of your application source code
COPY . .

# Build the Go application
RUN go build -o main

# Expose the port your application will listen on
EXPOSE 8080

# Command to run your application
CMD ["/app/main"]
```
+ ### Now we have to build "**Docker Image**" from "**Dockerfile**", for this we use command as shown below:-

```
docker build . -t voting-app-api
```
![API-Dockerfile](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-dockerfile.PNG)
+ ### Now docker image build see in image given below :-
![API-image](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-image.PNG)
+ ### Now we will store our image to ECR or DockerHub, so for ECR: Go to ECR → Create repository → select Public → name of repository → Create repository. Now commands to push image :-
```
(run command where API dockerfile is)
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/g1z2u9v4

docker tag voting-app-api:latest public.ecr.aws/g1z2u9v4/voting-app-api:latest

docker push public.ecr.aws/g1z2u9v4/voting-app-api:latest
```
+ ### We pushed our API image to ECR succesfully.
![ECR](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/ECR.PNG)
![ECR-Login](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/ecr-login.PNG)
![API-Push](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-push.PNG)
![API-ECR](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-ecr.PNG)
___
## STEP 4: Install AWS CLI v2 (run this command in home directory)
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install -i /usr/local/aws-cli -b /usr/local/bin --update
```
![Install AWS](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/install-aws.PNG)
+ ### Now we have to configure AWS CLI, for this we need IAM user. So to make IAM user, Go To IAM → Create user → Username → Next → Attach policies directly → select **AdministratorAccess** → Next → Create User. Now we will make security credentials. **Why? Because our AWS CLI can do identify my account.**  Now go to User → Security Credentials → Create access key → select CLI → Next → Create access key. So we will get **Access key** and **Secret access key**. Now go to instance and write command given below :-
```
aws configure
```
+ ### Now paste **Access key** and **Secret access key**.
![AWS-Version](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/aws-version.PNG)
+ ### Now to control K8s Cluster on EKS we will need to install kubectl tool. **To install kubectl** use command (run this command in home directory) :-
```
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short --client
```
![Install-Kubectl](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/install-kubectl.PNG)
+ ### Now to make K8s Cluster on EKS we will need to install eksctl tool. **To install eksctl** use command (run this command in home directory) :-
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```
![Install-EKS](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/install-eks.PNG)
+ ### Now to setup EKS Cluster use command :-
```
eksctl create cluster --name voting-app-eks-cluster --region us-west-2 --node-type t2.medium --nodes-min 2 --nodes-max 2
```
![Create-Cluster](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/create-cluster.PNG)
![Cluster](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/cluster.PNG)
+ ### Now go cluster “Add-ons” → Click “Get more add-ons” → select "Amazon EBS CSI Driver"
![Get-More-Ons](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/get-more-ons.PNG)
![Add-On](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/add-on.PNG)
+ ### Now click “Next” → again “Next” → Click “Create”.
+ ### Now add 1 policy in Node IAM role. Go to node and click “IAM role” → click "Attach Policy" → search "**AmazonEBSCSIDriverPolicy**" and add this Policy.
![Node-Policy](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/node-policy.PNG)
+ ### Now check nodes, use command :-
```
kubectl get nodes
```
+ ### We will get a refused error because we haven’t set up the context yet. Lets set up context, for this use command :-
```
aws eks update-kubeconfig --name voting-app-eks-cluster --region us-west-2
```
![EKS-Update](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/eks-update.PNG)
```
kubectl get nodes
```
![Nodes](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/nodes.PNG)
+ ### Our EKS Cluster and Nodes are working fine.
___
## STEP 5: Setup & Run Mongo
+ ### Now we will create a Mongo stateful set yaml file but before that we will create a namespace so for this use command :-
```
kubectl create namespace sudha
```
![NS](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/ns.PNG)
+ ### Now when we want to work within a specific namespace for our Kubernetes operations. We have to set our namespace as current, for this use command :-
```
kubectl config set-context --current --namespace sudha
```
+ ### After running this command, any subsequent kubectl commands we execute will be scoped to the **sudha** namespace, unless we specify a different namespace explicitly in our commands. This can be particularly useful when we have multiple namespaces in our Kubernetes cluster and we want to ensure that our operations are isolated to a specific namespace.
![NS-Context](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/ns-context.PNG)
```
kubectl create statefulset.yaml
```
```
# mongo-stateful set yaml file
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongo
  namespace: sudha
spec:
  serviceName: mongo
  replicas: 3
  selector:
    matchLabels:
      role: db
  template:
    metadata:
      labels:
        role: db
        env: demo
        replicaset: rs0.main
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: replicaset
                      operator: In
                      values:
                        - rs0.main
                topologyKey: kubernetes.io/hostname
      terminationGracePeriodSeconds: 10
      containers:
        - name: mongo
          image: mongo:4.2
          command:
            - "numactl"
            - "--interleave=all"
            - "mongod"
            - "--wiredTigerCacheSizeGB"
            - "0.1"
            - "--bind_ip"
            - "0.0.0.0"
            - "--replSet"
            - "rs0"
          ports:
            - containerPort: 27017
          volumeMounts:
            - name: mongodb-persistent-storage-claim
              mountPath: /data/db
  volumeClaimTemplates:
    - metadata:
        name: mongodb-persistent-storage-claim
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: gp2
        resources:
          requests:
            storage: 1Gi
```
+ ### Now to apply a Mongo stateful set with Persistent volumes, run the command :-
```
#to apply mongo-statefulset manifest file
kubectl apply -f mongo-statefulset.yaml
```
![Mongo-State](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-state.PNG)
```
#to check pods 
kubectl get pods
```
![Mongo-Pod](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-pod.PNG)
+ ### Now go to Aws console and click on nodes and storage. We will see now new 1Gb storage has been added to both nodes.
![1GB-Attach](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/1gb-attach.PNG)
+ ### Check whether persistent volumes are created or not
```
kubectl get pvc
```
![Mongo-PVC](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-pvc.PNG)
+ ### Now we will create a mongo-service yaml file, write command :-
```
kubectl create mongo-service.yaml
```
```
# mongo-service yaml file
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: sudha
  labels:
    role: db
    env: demo
spec:
  ports:
  - port: 27017
    targetPort: 27017
  selector:
    role: db
```

+ ### Now to apply a mongo-service yaml file, run the command :-
```
kubectl apply -f mongo-service.yaml
kubectl get svc -n sudha
```
![Mongo-SVC](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-svc.PNG)

+ ### Now let’s go inside the mongo-0 pod and we have to initialise the Mongo database Replica set :-
```
kubectl get pods
kubectl exec -it mongo-0 -- mongo
```
![Mongo-exec](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-exec.PNG)
+ ### In the terminal run the following command :-
```
rs.initiate();
sleep(2000);
rs.add("mongo-1.mongo:27017");
sleep(2000);
rs.add("mongo-2.mongo:27017");
sleep(2000);
cfg = rs.conf();
cfg.members[0].host = "mongo-0.mongo:27017";
rs.reconfig(cfg, {force: true});
sleep(5000);
```
+ ### Note: Wait until this command completes successfully, it typically takes 10-15 seconds to finish and completes with the message: bye

+ ### Load the Data in the database by running this command :-
```
use langdb
```
![Mongo-langdb](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-langdb.PNG)
![Lang-Switched](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/lang-switched.PNG)
+ ### Now paste given below data in the terminal :-
```
db.languages.insert({"name" : "csharp", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 5, "compiled" : false, "homepage" : "https://dotnet.microsoft.com/learn/csharp", "download" : "https://dotnet.microsoft.com/download/", "votes" : 0}});
db.languages.insert({"name" : "python", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 3, "script" : false, "homepage" : "https://www.python.org/", "download" : "https://www.python.org/downloads/", "votes" : 0}});
db.languages.insert({"name" : "javascript", "codedetail" : { "usecase" : "web, client-side", "rank" : 7, "script" : false, "homepage" : "https://en.wikipedia.org/wiki/JavaScript", "download" : "n/a", "votes" : 0}});
db.languages.insert({"name" : "go", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 12, "compiled" : true, "homepage" : "https://golang.org", "download" : "https://golang.org/dl/", "votes" : 0}});
db.languages.insert({"name" : "java", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 1, "compiled" : true, "homepage" : "https://www.java.com/en/", "download" : "https://www.java.com/en/download/", "votes" : 0}});
db.languages.insert({"name" : "nodejs", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 20, "script" : false, "homepage" : "https://nodejs.org/en/", "download" : "https://nodejs.org/en/download/", "votes" : 0}});
```
+ ### Now to see data in proper way use command given below :-
```
db.languages.find().pretty();
```
![Lang-Added](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/lang-added.PNG)
+ ### Now to exit from mongo-0 pod use command :-
```
exit #exit from conatiner
```
![Exit-Mongo](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/exit-mongo.PNG)
+ ### To confirm run this in the terminal:
```
kubectl exec -it mongo-0 -- mongo --eval "rs.status()" | grep "PRIMARY\|SECONDARY"
```
![Pri-Sec-Sec](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/pri-sec-sec.PNG)
+ ### Now we will create a mongo-secret yaml file, write command :-
```
kubectl create mongo-secret.yaml
```
```
# mongo-secret yaml file
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: sudha
data:
  username: c3VkaGEK   
  password: eWFkYXYK   
```
+ ### **In mongo-secret.yaml file we will write encryted password so how we can make encrypted password. Write echo 'sudha' | base64 and enter and we get our encryted username or password. Now how we can decode it? For this write echo 'encrypted username or password' | base64 --decode and we will get our real username or password.**
+ ### Now to apply a mongo-secret yaml file, run the command :-
```
kubectl apply -f mongo-sercet.yaml
```
![Mongo-Secret](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/mongo-sercet.PNG)
___

## STEP 6: Setup & Run API
+ ### Now we will create a API deployment yaml file so for this use command :-
```
kubectl create api-deployment.yaml
```
```
# api-deployment yaml file
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: sudha
  labels:
    role: api
    env: demo
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 25%
  selector:
    matchLabels:
      role: api
  template:
    metadata:
      labels:
        role: api
    spec:
      containers:
      - name: api
        image: sudhajobs0107/voting-app-api:latest #change image name
        imagePullPolicy: Always
        env:
          - name: MONGO_CONN_STR
            value: mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017/langdb?replicaSet=rs0
          - name: MONGO_USERNAME
            valueFrom:
              secretKeyRef:
                name: mongodb-secret
                key: username
          - name: MONGO_PASSWORD
            valueFrom:
              secretKeyRef:
                name: mongodb-secret
                key: password
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /ok
            port: 8080
          initialDelaySeconds: 2
          periodSeconds: 5
        readinessProbe:
          httpGet:
             path: /ok
             port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          successThreshold: 1
```
+ ### Now to apply a api deployment file, run the command :-
```
#to apply manifest file
kubectl apply -f api-deployment.yaml
#to check pods 
kubectl get pods  (or) 
kubectl get all
```
![API-Pod](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-pod.PNG)
+ ### Now we will create a api-service yaml file, write command :-
```
kubectl create api-service.yaml
```
```
# api-service yaml file
#Imperative command to create service to expose frontend deployment 
#kubectl expose deploy api \ --name=api \ --type=LoadBalancer \ --port=80 \ --target-port=8080
apiVersion: v1
kind: Service
metadata:
  name: api
  labels:
    app: api
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```
+ ### Now we can apply api-service yaml file or directly expose, run the command :-
```
kubectl apply -f api-service.yaml (and)
kubectl get svc
```
![API-lb](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-lb.PNG)
+ ### Now we will see 1 Load Balancer will be created in your AWS account.
![API-lb-AWS](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-lb-aws.PNG)
+ ### Now set the environment variable:-
```
{
API_ELB_PUBLIC_FQDN=$(kubectl get svc api -ojsonpath="{.status.loadBalancer.ingress[0].hostname}")
until nslookup $API_ELB_PUBLIC_FQDN >/dev/null 2>&1; do sleep 2 && echo waiting for DNS to propagate...; done
curl $API_ELB_PUBLIC_FQDN/ok
echo
}
```
![API-lb-OK](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-lb-ok.PNG)
![API-lb-OK1](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/api-lb-ok1.PNG)
___
## STEP 7: Setup & Run Frontend
### Now we will make **Dockerfile** for frontend, so go to frontend directory and write command :-
```
vim Dockerfile
```
### And we are in Dockerfile. Write code as shown below :-
```
# Use Node.js 16 image
FROM node:16 as build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve the React app using NGINX
FROM nginx:alpine

# Remove the default NGINX welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
```
![Frontend-Dockerfile](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-dockerfile.PNG)
### Now we have to build "**Docker Image**" from "**Dockerfile**", for this we use command as shown below :-
```
docker build . -t voting-app-frontend
```
![Frontend-Image](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-image.PNG)
+ ### Now same as api we will store our image to ECR or DockerHub, so for ECR: Go to ECR → Create repository → select Public → name of repository → Create repository and push image to ECR.
+ ### See here we pushed our frontend image succesfully.
![Frontend-ECR](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-ecr.PNG)

+ ### Now we will create a Frontend deployment yaml file so for this use command :-
```
kubectl create frontend-deployment.yaml
```
```
# api-deployment yaml file
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: sudha
  labels:
    role: frontend
    env: demo
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 25%
  selector:
    matchLabels:
      role: frontend
  template:
    metadata:
      labels:
        role: frontend
    spec:
      containers:
      - name: frontend
        image: sudhajobs0107/voting-app-frontend:latest  #change image name
        imagePullPolicy: Always
        env:
          - name: REACT_APP_APIHOSTPORT
            value: aa00164c0518041098c478e090c33bc6-783999949.us-east-2.elb.amazonaws.com #Here add your API_EXTERNAL_IP manually
        ports:
        - containerPort: 80
```
+ ### Now to apply a frontend deployment file, run the command :-
```
kubectl apply -f frontend-deployment.yaml
```
![Frontend-Apply](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-apply.PNG)
```
#to check pods 
kubectl get pods  (or) 
kubectl get all
```
![Frontend-Pod](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-pod.PNG)
+ ### Now we will create a frontend-service yaml file, write command :-
```
kubectl create frontend-service.yaml
```
```
# frontend-service yaml file
#Imperative command to create service to expose frontend deployment 
#kubectl expose deploy frontend \ --name=frontend \ --type=LoadBalancer \ --port=80 \ --target-port=80
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```
+ ### Now we can apply frontend-service yaml file or directly expose, run the command :-
```
kubectl apply -f frontnend-service.yaml
kubectl get svc -n sudha
```
![Frontend-Expose](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-expose.PNG)
![Frontend-SVC](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-svc.PNG)

+ ### Next, set the environment variable:-
```
{
FRONTEND_ELB_PUBLIC_FQDN=$(kubectl get svc frontend -ojsonpath="{.status.loadBalancer.ingress[0].hostname}")
until nslookup $FRONTEND_ELB_PUBLIC_FQDN >/dev/null 2>&1; do sleep 2 && echo waiting for DNS to propagate...; done
curl -I $FRONTEND_ELB_PUBLIC_FQDN
}
```
![Frontend-lb-OK](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-lb-ok.PNG)
+ ### Now generate the Frontend URL for browsing. In the terminal run the following command:-
```
echo http://$FRONTEND_ELB_PUBLIC_FQDN
```
![Frontend-Url](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/frontend-url.PNG)

+ ### Now cpoy URL and paste it into the browser. We will get our application running :-
![App-Running](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/app-running.PNG)

+ ### After the voting application has loaded successfully, vote by clicking on several of the +1 buttons. This will generate AJAX traffic which will be sent back to the API via the API’s assigned ELB.

+ ### Query the MongoDB database directly to observe the updated vote data. In the terminal execute the following command:
```
kubectl exec -it mongo-0 -- mongo langdb --eval "db.languages.find().pretty()"
```
![Vote-Data-Save](https://github.com/sudhajobs0107/EKS-voting-app-3-tier/blob/main/doc/images/vote-data-save.PNG)
___





# **Our 3-Tier-Language-Vote-App Project is completed :smile:**
___
