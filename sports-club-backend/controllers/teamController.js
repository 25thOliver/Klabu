const Team = require('../models/Team');

// ✅ Admin: Create a team
const createTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create teams' });
    }

    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const exists = await Team.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Team already exists' });

    const team = await Team.create({ name, description });
    res.status(201).json(team);
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ message: 'Failed to create team' });
  }
};

// ✅ Member: Request to join a team
const requestJoinTeam = async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  const userId = req.user._id;

  if (team.members.includes(userId)) {
    return res.status(400).json({ message: 'Already a member' });
  }

  if (team.joinRequests.includes(userId)) {
    return res.status(400).json({ message: 'Already requested' });
  }

  team.joinRequests.push(userId);
  await team.save();
  res.json({ message: 'Join request sent' });
};

// ✅ Admin: Approve a member
const approveJoinRequest = async (req, res) => {
  const { teamId, userId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  if (!team.joinRequests.includes(userId)) {
    return res.status(400).json({ message: 'No such request' });
  }

  team.members.push(userId);
  team.joinRequests = team.joinRequests.filter(id => id.toString() !== userId);
  await team.save();

  res.json({ message: 'User approved' });
};

// ✅ Member: Leave a team
const leaveTeam = async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  team.members = team.members.filter(
    id => id.toString() !== req.user._id.toString()
  );
  await team.save();

  res.json({ message: 'Left team' });
};

// ✅ Get teams
const getTeams = async (req, res) => {
  const teams = await Team.find()
    .populate('members', 'name email')
    .populate('joinRequests', 'name email');
  res.json(teams);
};

module.exports = {
  createTeam,
  requestJoinTeam,
  approveJoinRequest,
  leaveTeam,
  getTeams
};
