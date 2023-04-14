# BlockMenu

![BlockMenu - Cover](https://user-images.githubusercontent.com/101031495/232161680-cddd0de4-a07b-4d3c-b542-3d8d0b9192e6.png)

## Quick Links
- [📹 Video Presentation](https://youtu.be/lPTJ8-wMcWA)
- [🏠 Website](https://www.blockmenu.xyz)
- [🚀 Deploy a Contract](https://www.blockmenu.xyz/deploy)
- [⚡️ Admin Login](https://www.blockmenu.xyz/admin/auth)
- [📖 Documentation](https://www.blockmenu.xyz)


-----

**Project Goal**:
The goal of the BlockMenu project is to provide a decentralized and cost-effective solution for restaurant management. By leveraging blockchain technology and BTTC cryptocurrency, our app aims to simplify the menu management, order receiving, and payment processes for restaurant owners while offering a seamless and convenient experience for their customers. We also aim to promote financial inclusivity by allowing customers without a BTCC wallet to still enjoy the benefits of our app. Our ultimate goal is to transform the restaurant industry by providing an innovative and accessible solution that enhances the overall dining experience for everyone involved.

**Smart Contract Links:**
[BTTScan (Testnet): 0xfd67266db32dda667fab09f52da4d104e88ae822](https://testnet.bttcscan.com/address/0xfd67266db32dda667fab09f52da4d104e88ae822) 

## Project Test Instructions

**Testing the Customer Experience**

1 - Make sure you have MetaMask installed on your browser with BTTC network configured on Testnet

2 - With your mobile device, scan the QR Code below:

![image](https://user-images.githubusercontent.com/101031495/232162801-e2d48e94-8d5d-4cab-ba3e-b31152def578.png)


Or, alternatively open this link on your mobile phone: https://blockmenu.xyz/app/start?contract=0xfd67266db32dda667fab09f52da4d104e88ae822

Note: Despite you can open this link on browser, this link is optimized for mobile devices.

3 - Connect your MetaMask Wallet

4 - Create some orders

5 - Submit your orders

6 - Pay the bill

**Testing the Restaurant Owner / Staff**

In order, to test the restaurant admin, you will need to deploy the smart contract using our UI. It's pretty easy and you can do it in the browser:

1 - Go to the link https://www.blockmenu.xyz/deploy

2 - Select the BlockMenu version. Currently, we only have the BETA version,.

3 - Select the option "Sample Restaurant Data" so you can deploy your contract with a sample menu which is good to test.

4 - Click in "Deploy". After that you can click in "Go to BlockMenu Admin" link

![image](https://user-images.githubusercontent.com/101031495/232162904-7928cb88-d038-4000-b199-c2aabc83d097.png)

On the admin there are some features to test, you can start by adding some items to the Menu, generate a QR Code and test the Customer Experience again but this time using your restaurant.


**Features:**
* Menu Management: Easily manage and update your restaurant's menu from a user-friendly dashboard
* Order Receiving: Receive orders from customers through the app and keep track of them in real-time
* Payment Processing: Accept payments in BTTC cryptocurrency through a secure and decentralized payment system
* Staff Management: Add and manage waiters and admins with different levels of access to the app
* Appearance Configuration: Customize the app's appearance to match your restaurant's brand and style
* Off-Chain Orders: Customers without a BTTC wallet can still view the menu and the waiter can register the orders and mark the bill as paid off-chain.
* Tips: Automatically transfer tips to waiters through the app's smart contract feature when a bill is paid

-----

Update:

As the project is aiming to be a real-life use case, during the Hackathon, we made a pivot from using TRON to BitTorrent-Chain as the main chain for the dApp. This decision was made with the aim of providing a more affordable platform for users, given the low fees associated with using BitTorrent-Chain.

------

**Milestones**

**Completed:**

March 25, 2023: TRON development was set up using TronBox.

March 25, 2023: Initial restaurant staff management was implemented.

March 25, 2023: Github Actions integration was added and tests were improved.

March 25, 2023: The Billable feature was added, including the createBill function.

March 25, 2023: The createOrder function was implemented.

March 26, 2023: The getAccountCurrentBill and getBillTotalAmount methods were added.

March 27, 2023: The assignWaiterToBill and payBill functions were implemented.

March 28, 2023: The app's theme was updated.

April 1, 2023: The web app integration with the smart contract was implemented, allowing users to get menu information. The smart contract was also deployed on the web app.

April 3, 2023: Customers can now view the restaurant menu, create a bill, and create orders on the app. Menu management was also added.

April 5, 2023: Created BlockMenuWrapper to make the app more extensible for users.

April 6, 2023: Pivoting from TRON to BTTC to lower fees for restaurants and customers.

April 8, 2023: Implement the restaurant dashboard with real-time orders (auto-reload) to help restaurant owners better manage their orders and deliver the meals.

April 10, 2023: Implement staff management, including the ability to assign a waiter to a bill, allowing for a more streamlined and efficient workflow in the restaurant.

April 13, 2023: Add appearance customization features to the app, giving restaurant owners more control over how their app looks and feels.

April 14, 2023: Final improvements and Launch Day! 🚀 🍽
