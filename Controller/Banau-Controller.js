const Banau = require("../Model/Banau");
const User = require("../Model/User-model");


const testMultipleCreation = async (req, res) => {
    try {
        const randomName = `Banau_${Math.random().toString(36).substr(2, 5)}`;
        const newBanau = new Banau({ name: randomName });
        await newBanau.save();
        res.status(201).json(newBanau);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getBanau = async (req, res) => {
    try {
        const banau = await Banau.
            findOne({ name: 'Banau' }).populate([{ path: 'staff', select: '_id name email isBanauAdmin banauRoles' }]);
        res.status(200).json({ message: 'Banau retrieved successfully', banau });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};

const addEmployee = async (req, res) => {
    try {
        const { email, role = 'staff' } = req.body; // Get email and role from request body, default role to 'staff'
        console.log('[+] Add employee hit', { email, role });
        if (!email)
            throw new Error('[-] Email Required');

        const user = await User.findOne({ email: email });
        if (!user)
            throw new Error("[-] User Not found");
        const banau = await Banau.findOne({ name: 'Banau' });
        if (banau.staff.includes(user._id))
            throw new Error('[+] Is already a part of Banau team');


        // Update user properties
        user.isBanauAdmin = true;
        user.banauRoles.role = role;

        // Save the updated user
        await user.save();

        // Find Banau instance (assuming there's only one)

        if (!banau) {
            throw new Error("[-] Banau Not found");
        }

        // Add user to Banau staff if not already added this is for v1 controller method
        if (!banau.staff.includes(user._id)) {
            banau.staff.push(user._id);
            await banau.save();
        }
        console.log({ 'rand': user });
        res.status(200).json({ ok: true, message: "User added to Banau staff and updated successfully" });
    } catch (error) {
        console.log(`[+] Something went wrong in add:`, error.message);
        return res.status(500).json({ ok: false, error: error.message });
    }
};

const updateEmployeeRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role = 'staff' } = req.body; // Get userId and role from request body, default role to 'staff'

        if (!userId)
            throw new Error('[-] User ID Required');


        const user = await User.findById(userId);

        if (!user)
            throw new Error("[-] User Not found");

        if (!user.isBanauAdmin)
            throw new Error("[-] Not a part of Banau Team");

        // Find Banau instance (assuming there's only one)
        const banau = await Banau.findOne({ name: 'Banau' });

        if (!banau)
            throw new Error("[-] Banau Not found");

        // Check if user is a part of Banau staff
        if (!banau.staff.includes(user._id))
            throw new Error("[-] User is not part of Banau staff");

        // Update user role
        user.banauRoles.role = role;

        // Save the updated user
        await user.save();

        res.status(200).json({ ok: true, message: "User role updated successfully" });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const userId = req.params.id; // Get userId from request body

        if (!userId)
            throw new Error('[-] User ID Required');


        const user = await User.findById(userId);

        if (!user)
            throw new Error("[-] User Not found");
        if (!user.isBanauAdmin)
            throw new Error("[-] Not a part of Banau Team");

        // Find Banau instance (assuming there's only one)
        const banau = await Banau.findOne({ name: "Banau" });

        if (!banau)
            throw new Error("[-] Banau Not found");
        // Check if user is a part of Banau staff
        if (!banau.staff.includes(user._id))
            throw new Error("[-] User is not part of Banau staff");


        // Remove user from Banau staff and make the isBanauAdmin false->Not an employee
        banau.staff.pull(user._id);
        user.isBanauAdmin = false;
        user.banauRoles.role = "";

        // update the user
        await user.save();
        // Save the updated Banau instance
        await banau.save();

        res.status(200).json({ ok: true, message: "User removed from Banau staff successfully" });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = { getBanau, addEmployee, updateEmployeeRole, deleteEmployee, testMultipleCreation };