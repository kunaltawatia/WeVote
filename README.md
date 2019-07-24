# WeVote [![Build Status](https://dev.azure.com/kunaltawatia/WeVote/_apis/build/status/kunaltawatia.WeVote?branchName=master)](https://dev.azure.com/kunaltawatia/WeVote/_build/latest?definitionId=2&branchName=master)

A Distributed Application for Electoral Voting and Polling, based on ethereum blockchain.  
It basically consists of three parts: Voting application , Candidate comparator and Registration Portal .

  
#### VOTING APPLICATION :
The voting application is a distributed application based on Azure blockchain . It consists of an admin node and voters on blockchain . The voters can cast their votes securely to the candidate of their choice while at the same time maintaining their privacy. When a voter cast  his/her vote, the hash of  password and choice of candidate gets transacted to admin node. This transaction helps for authentication and identification and thus maintains the transparency of voting procedure.


#### REGISTRATION PORTAL :

The registration portals lets users register them self for next election , If user is above 18 years and satisfy all conditions then verification is done by officials of election and user will be added to the voter list . If user is below 18 years but satisfy all other conditions then that user will be added to temporary list and whenever he turns 18 he will be added to the voter list ,  this ensures involvement of all citizens in election .


#### CANDIDATE COMPARATOR :
 
The candidate comparator allows voters to check the profile of candidate of given state and constituency  . Thus it helps voters to effectively use their vote and cast their vote to correct candidate . The candidate comparator lets users judge a candidate on the basis of criteria like education, criminal records, social work done, awards and recognition, their career before politics, and property owned by them.
   
___
## Deploy on local machine
* ### Install [Node.js](https://nodejs.org/en/download/current/)
> Deploying this app requires node package manager `npm`
* ### Clone the repository
> Download this repository `or`
```
git clone https://github.com/kunaltawatia/WeVote.git
cd WeVote
```
* ### Install dependencies
```
npm install
```
* ### Run `development server`
```
npm start
```
* ### Run `production build`
```
npm run build
```
___
#### Team 
    - Kunal Tawatia
    - Priyanshi Jain
    - Venkatesh Kotwade
    
    WeBug 
    Indian Institute of Technology, Jodhpur
