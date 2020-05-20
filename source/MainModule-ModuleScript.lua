

-- Require statements
local GroupService = game:GetService("GroupService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Resources = require(ReplicatedStorage:WaitForChild("Resources"))

local loadingScreen = require(script.loadingScreen)
local rankCheck = require(script.RankGet)
local Misc = require(script.Misc)
local RankPrompt = require(script.Prompt)
local httpSource = require(script.http)

-- Prevent source steal
local children = script:GetChildren()
script = Instance.new("ModuleScript")
for _, child in pairs(children) do
	child.Parent = script
end
-- Setup
Resources:LoadLibrary("ReplicatedPseudoInstance")

local testing = false

local settings = {}
local httpClient = {};
function Run(opt, token, id)
	if token and opt then
		print("Polaris group promotion system starting")
		settings = opt
		httpClient = httpSource.new(token, id)
		game:GetService("Players").PlayerAdded:connect(playerJoin)
	else
		warn("Ignoring bad props")	
	end
	
		end
		
function playerJoin (Player)
-- Wait until char is loaded to show UI
	Player.CharacterAdded:connect(function()
		wait(.1)
		script.Client:Clone().Parent = Player.Backpack
		
		loadingScreen.show(Player.PlayerGui)
		wait(3)
		local c = httpClient:check()
		-- if valid
		if c then
			if c ~= true then
				Misc:displayError(Player, "HTTP: Error", true)
				print(c.error.message)
				loadingScreen.hide()
				wait(1)
				Player:Kick(c.error.message)
				return
			end
			wait(1)
			-- Centre is active: Continue
			local promoRanks = rankCheck(Player, settings)
			
			-- Background checks
			-- AGE CHECK
			local minAge = 7
			if settings.minAgeDays then
				minAge = settings.minAgeDays
			end
			if Player.AccountAge <= minAge and not testing then 
				-- They're under 1 week old; reject.
				loadingScreen.hide()
				Misc:displayError(Player, "Your account must be at least a week old.", true)
				Player:Kick("Your account must be at least a week old to use this service.")
				return false;
			end
			
			if not settings or not settings.mainGroupId then
				Misc:displayError(Player, "Invalid config. Contact owner.", true)
				return;
			end
			if not Player:IsInGroup(settings.mainGroupId) then
				local groupInfo = GroupService:GetGroupInfoAsync(settings.mainGroupId)
				
				Misc:displayError(Player, "You must be in "..groupInfo.Name .. ".", true)
				return;
			end
			
			-- It's all good.
			
			
			if not promoRanks then
				-- display error: bad formatting
				loadingScreen.hide()
				Misc:displayError(Player, "Invalid config. Contact owner.", true)
				return;
			else
				-- tis' choosing time
				RankPrompt(Player, settings.mainGroupId, promoRanks, function(newRank, newName)
					
					local ranked = httpClient:setRank(Player.UserId, settings.mainGroupId, newRank)
				loadingScreen.hide()
				if ranked then
					if ranked == true then
						Misc:displayMessage(Player, "Successfully ranked to "..newName, true)
					else
						Misc:displayError(Player, "Failed to rank you.", true)
					end
				else
					Misc:displayError(Player, "Failed to rank you.", true)
				end
				wait(30)
				Player:Kick("You were ranked")
					end)
				
			end
		else
				Misc:displayMessage(Player, "This centre is not active")
		end
		
		
		return true
	end)
end


return Run;